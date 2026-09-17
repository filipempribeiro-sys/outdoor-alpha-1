# PROJECT RULES — GitHub Actions

## Mandatory operating rule

GitHub Actions minutes must be protected during normal development.

- Checkpoints, routine commits and rollbacks must NOT intentionally trigger APK builds, releases, wake jobs or other expensive CI jobs.
- APK/build/release workflows must remain manual (`workflow_dispatch`) unless Filipe explicitly authorizes an automatic trigger.
- Render/backend wake workflows must remain manual (`workflow_dispatch`) unless Filipe explicitly authorizes reactivation of a schedule.
- Do not add or reactivate `schedule`, broad `push`, `pull_request` or other automatic triggers for expensive jobs without explicit authorization from Filipe.
- Before changing `.github/workflows/`, audit the resulting automatic Actions impact.
- Prefer batching routine changes/checkpoints so that unavoidable deployment workflows are not triggered unnecessarily.
- A change that introduces new automatic GitHub Actions consumption is a CRITICAL CHANGE and requires Filipe's approval before implementation.

## ALPHA-specific exception

GitHub Pages may deploy automatically from `main`. Treat this as an unavoidable deployment trigger until its publishing architecture is deliberately changed. Avoid unnecessary commits to `main` solely for bookkeeping when the same checkpoint can be preserved without a deployment.

## Development principle

Normal coding and checkpointing should consume zero GitHub-hosted runner minutes whenever technically possible. Generate builds/releases only when explicitly requested.
