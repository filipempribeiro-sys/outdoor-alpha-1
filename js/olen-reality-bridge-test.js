/* OLEN 5.0 — Reality Bridge deterministic contracts */
(function (global) {
  'use strict';

  function assert(condition, message) { if (!condition) throw new Error(message || 'assertion_failed'); }
  function equal(a, b, message) { assert(a === b, message || (String(a) + ' !== ' + String(b))); }

  async function run() {
    const bridge = global.OLEN5 && global.OLEN5.realityBridge;
    const originalReality = global.OlenReality;
    const results = [];
    async function test(name, fn) {
      try { await fn(); results.push({ name: name, ok: true }); }
      catch (error) { results.push({ name: name, ok: false, error: error && error.message ? error.message : String(error) }); }
    }

    await test('Starts disabled and fail-safe', async function () {
      bridge.configure({ enabled: false });
      const result = await bridge.evaluate({});
      equal(result.ok, false); equal(result.skipped, true); equal(result.reason, 'disabled');
    });

    await test('Clamps timeout configuration', async function () {
      equal(bridge.configure({ enabled: false, timeoutMs: 1 }).timeoutMs, 250);
      equal(bridge.configure({ enabled: false, timeoutMs: 99999 }).timeoutMs, 10000);
    });

    await test('Fails safe when Reality client is unavailable', async function () {
      bridge.configure({ enabled: true }); global.OlenReality = null;
      const result = await bridge.evaluate({});
      equal(result.ok, false); equal(result.skipped, true); equal(result.reason, 'client_unavailable');
      global.OlenReality = originalReality;
    });

    await test('Delegates to opaque client only when enabled', async function () {
      let calls = 0;
      global.OlenReality = { DEFAULT_PATH: '/api/olen/reality', evaluate: async function () { calls += 1; return { contract: 'olen.reality.v1', status: 'supported' }; } };
      bridge.configure({ enabled: true });
      const result = await bridge.evaluate({ requiredFields: ['open'], evidence: [] });
      equal(calls, 1); equal(result.ok, true); equal(result.reality.status, 'supported');
      global.OlenReality = originalReality;
    });

    await test('Uses configured endpoint without embedding backend host', async function () {
      let endpoint = '';
      global.OlenReality = { DEFAULT_PATH: '/api/olen/reality', evaluate: async function (_, options) { endpoint = options.endpoint; return { contract: 'olen.reality.v1' }; } };
      bridge.configure({ enabled: true, endpoint: 'https://example.invalid/api/olen/reality' });
      await bridge.evaluate({}); equal(endpoint, 'https://example.invalid/api/olen/reality');
      global.OlenReality = originalReality;
    });

    await test('Contains client failures instead of breaking shell flow', async function () {
      global.OlenReality = { DEFAULT_PATH: '/api/olen/reality', evaluate: async function () { throw new Error('backend_down'); } };
      bridge.configure({ enabled: true });
      const result = await bridge.evaluate({});
      equal(result.ok, false); equal(result.skipped, false); equal(result.reason, 'backend_down');
      global.OlenReality = originalReality;
    });

    await test('Times out slow Reality calls', async function () {
      global.OlenReality = { DEFAULT_PATH: '/api/olen/reality', evaluate: function () { return new Promise(function () {}); } };
      bridge.configure({ enabled: true, timeoutMs: 250 });
      const result = await bridge.evaluate({});
      equal(result.ok, false); equal(result.reason, 'reality_timeout');
      global.OlenReality = originalReality;
    });

    await test('Exposes only the public bridge surface', async function () {
      const keys = Object.keys(bridge);
      assert(keys.includes('configure') && keys.includes('state') && keys.includes('evaluate'));
      assert(!keys.includes('score') && !keys.includes('fuse') && !keys.includes('weights'));
    });

    global.OlenReality = originalReality;
    bridge.configure({ enabled: false });
    const passed = results.filter(function (item) { return item.ok; }).length;
    return Object.freeze({ ok: passed === results.length, score: passed + '/' + results.length, passed: passed, total: results.length, results: Object.freeze(results) });
  }

  global.OLEN5 = global.OLEN5 || {};
  global.OLEN5.realityBridgeTest = Object.freeze({ run: run });
})(typeof window !== 'undefined' ? window : globalThis);
