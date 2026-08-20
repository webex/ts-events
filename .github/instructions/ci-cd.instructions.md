---
applyTo: ".github/workflows/**,release.config.js,package.json,rollup.config.js"
name: ts-events CI/CD
description: Use when reviewing pull-request checks, builds, package entry points, or semantic-release behavior.
---

# CI/CD Instructions

## Pull-request checks

- Read `.github/workflows/pull-request-checks.yml` before changing or describing CI.
- Pull requests install with Yarn, then run `yarn test:lint` and `yarn test:coverage`.
- Prettier, spelling, build, TypeScript validation, browser integration scripts, and the aggregate `yarn test` command are not current pull-request gates.
- Do not describe scripts without working configuration as CI coverage.

## Build and package outputs

- Rollup builds ESM, CommonJS, UMD, minified UMD, and TypeScript declaration outputs from `src/index.ts`.
- Keep `package.json` entry points aligned with Rollup outputs.
- The browser build resolves `events` through the configured Node polyfill.
- Generated API files belong under `docs/api/`, with temporary extractor output under `docs/temp/`.
- Cleanup must not delete maintained files under `docs/contributing/` or `docs/knowledge-base/`.

## Release

- Pushes to `main` run `yarn build` followed by semantic-release.
- Conventional Commits on `main` determine whether semantic-release publishes and which version increment applies.
- The release configuration publishes to npm and commits its configured release assets.
- Treat changes to `src/index.ts`, exported signatures, entry points, bundles, or runtime dependencies as compatibility-sensitive.

## Failure triage and safety

- Fix deterministic lint, test, type, or build failures. Do not rerun them hoping for a different result.
- Retry only failures supported by evidence of transient runner, registry, or network problems.
- Treat a release failure on `main` as a coordinated delivery issue.
- Never expose workflow tokens or publish credentials.
- Do not run semantic-release or npm publishing locally unless the user explicitly requests a coordinated release.
