/* OLEN 5.0 — Reality Client deterministic contracts */
(function (global) {
  'use strict';

  function assert(condition, message) { if (!condition) throw new Error(message || 'assertion_failed'); }
  function equal(a, b, message) { assert(a === b, message || (String(a) + ' !== ' + String(b))); }
  function deep(a, b, message) { assert(JSON.stringify(a) === JSON.stringify(b), message || 'deep_equal_failed'); }

  async function run() {
    const reality = global.OlenReality;
    const results = [];
    async function test(name, fn) {
      try { await fn(); results.push({ name: name, ok: true }); }
      catch (error) { results.push({ name: name, ok: false, error: error && error.message ? error.message : String(error) }); }
    }

    await test('Exposes stable Reality contract and endpoint', async function () {
      equal(reality.CONTRACT, 'olen.reality.v1');
      equal(reality.DEFAULT_PATH, '/api/olen/reality');
    });

    await test('Builds bounded normalized requests', async function () {
      const req = reality.request({ requestId: ' r1 ', experienceId: ' x1 ', requiredFields: [' open ', 'open', 'price'], evidence: Array(101).fill({ id: 'e' }) });
      equal(req.requestId, 'r1'); equal(req.experienceId, 'x1');
      deep(req.requiredFields, ['open', 'price']); equal(req.evidence.length, 100);
    });

    await test('Sanitizes responses to the public contract', async function () {
      const res = reality.response({ contract: 'olen.reality.v1', status: 'supported', complete: true, confidence: 0.99, confidenceBand: 'high', facts: [{ field: 'open', resolved: true, value: true, confidence: 0.99, confidenceBand: 'high', selectedEvidenceId: 'secret' }] });
      equal(res.confidence, undefined); equal(res.facts[0].confidence, undefined); equal(res.facts[0].selectedEvidenceId, undefined);
      deep(Object.keys(res), ['contract','requestId','experienceId','status','complete','confidenceBand','missing','facts']);
    });

    await test('POSTs only the opaque Reality request', async function () {
      let seenUrl = null, seenOptions = null;
      const fakeFetch = async function (url, options) { seenUrl = url; seenOptions = options; return { ok: true, status: 200, json: async function () { return { contract: 'olen.reality.v1', status: 'supported', complete: true, confidenceBand: 'high', missing: [], facts: [] }; } }; };
      await reality.evaluate({ requiredFields: ['open'], evidence: [] }, { fetch: fakeFetch });
      equal(seenUrl, '/api/olen/reality'); equal(seenOptions.method, 'POST');
      equal(JSON.parse(seenOptions.body).contract, 'olen.reality.v1');
    });

    await test('Allows an explicit backend endpoint without hardcoding a host', async function () {
      let seenUrl = null;
      const fakeFetch = async function (url) { seenUrl = url; return { ok: true, status: 200, json: async function () { return { contract: 'olen.reality.v1', status: 'insufficient_evidence', complete: false, confidenceBand: 'low', missing: ['open'], facts: [] }; } }; };
      await reality.evaluate({ requiredFields: ['open'], evidence: [] }, { fetch: fakeFetch, endpoint: 'https://backend.example/api/olen/reality' });
      equal(seenUrl, 'https://backend.example/api/olen/reality');
    });

    await test('Rejects non-success HTTP responses deterministically', async function () {
      let caught = null;
      try { await reality.evaluate({}, { fetch: async function () { return { ok: false, status: 429 }; } }); } catch (error) { caught = error; }
      equal(caught && caught.message, 'reality_request_failed'); equal(caught && caught.status, 429);
    });

    await test('Rejects incompatible Reality contracts', async function () {
      let caught = null;
      try { await reality.evaluate({}, { fetch: async function () { return { ok: true, status: 200, json: async function () { return { contract: 'olen.reality.v0' }; } }; } }); } catch (error) { caught = error; }
      equal(caught && caught.message, 'reality_contract_mismatch');
    });

    await test('Never promotes unknown confidence bands', async function () {
      const res = reality.response({ confidenceBand: 'super-high', facts: [{ field: 'x', resolved: true, value: 1, confidenceBand: 'secret-score' }] });
      equal(res.confidenceBand, 'low'); equal(res.facts[0].confidenceBand, 'low');
    });

    const passed = results.filter(function (item) { return item.ok; }).length;
    return Object.freeze({ ok: passed === results.length, score: passed + '/' + results.length, passed: passed, total: results.length, results: Object.freeze(results) });
  }

  global.OlenRealityTest = Object.freeze({ run: run });
})(typeof window !== 'undefined' ? window : globalThis);
