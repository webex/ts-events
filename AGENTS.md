# AGENTS.md

## Project Overview

`@webex/ts-events` is a public TypeScript library for type-safe events. It lets a class expose typed `on`, `once`, and `off` methods while keeping control of when its events are emitted. The same pattern supports events defined at different levels of a class inheritance chain.

Start with [README.md](README.md) for usage and [docs/knowledge-base/README.md](docs/knowledge-base/README.md) for the package architecture, dependency roles, runtime boundaries, and source map.

## General Guidelines

- Be direct, analytical, and evidence-based.
- Derive commands, versions, public exports, and behavior from checked-in source and configuration.
- Treat `src/index.ts` as the public source export boundary and `package.json` as the authority for package entry points and dependencies.
- Read the knowledge base before wide searches about architecture or module ownership.
- When guidance conflicts, current source and repository configuration win.

## Agent Rules

1. Cite repository paths, config keys, tests, or stable public links for factual claims.
2. Use public sources only. Do not add private issue links, documentation hosts, consumer chains, or enterprise-only skills.
3. Never commit secrets, credentials, `.pem`, `.key`, certificate, or decrypted `.env` content.
4. Do not add absolute local paths to committed files.
5. Create commits or push changes only when the user explicitly asks.

### Committing files

- Stage explicit paths only. Do not use `git add .` or `git add -A`.
- Stage only files changed for the current task.
- Before committing, inspect `git status` and the staged diff for secrets, keys, certificates, local paths, or unrelated changes.

### Knowledge base

The curated knowledge base under `docs/knowledge-base/` is maintained separately from generated API documentation.

- Read it for package boundaries, direct dependency roles, inheritance behavior, browser packaging, and release behavior.
- Verify implementation details against `src/`, tests, and configuration.
- Ask before adding new knowledge-base articles beyond the maintained index and architecture overview.
- Keep public repository content limited to publicly verifiable facts.

## Repository Layout

| Path | Purpose |
|---|---|
| `src/index.ts` | Public source export barrel |
| `src/typed-event.ts` | Typed wrapper around an internal event emitter |
| `src/event-mixin.ts` | Class extension helper and its public subscription type |
| `src/**/*.spec.ts` | Co-located Jest unit tests |
| `src/examples/` | Basic and inheritance usage examples |
| `rollup.config.js` | ESM, CommonJS, and UMD builds |
| `.github/workflows/` | Pull-request checks and main-branch publishing |
| `docs/knowledge-base/` | Maintained architecture guidance |
| `docs/api/` | Reserved for generated API documentation |

## Setup

Use the Node version selected by `.nvmrc` and the Yarn version pinned by `package.json`.

```bash
nvm use
yarn install
yarn prepare
```

Do not use npm for dependency installation. `package.json` sets `engines.npm` to `please-use-yarn`.

## Development Commands

Run commands from the repository root.

| Command | Purpose |
|---|---|
| `yarn build` | Clean generated output and build ESM, CommonJS, UMD, and declaration artifacts |
| `yarn watch` | Run the Rollup build in watch mode |
| `yarn transpile:validate` | Type-check with TypeScript without emitting files |
| `yarn test:unit` | Run Jest unit tests |
| `yarn test:coverage` | Run Jest with coverage |
| `yarn test:lint` | Run ESLint on TypeScript source |
| `yarn test:prettier` | Check source formatting |
| `yarn test:spelling` | Spellcheck maintained source and documentation |
| `yarn fix` | Apply configured Prettier and ESLint fixes |

`package.json` includes Karma packages and browser integration scripts, but the repository has no Karma configuration file. Those browser tests are therefore not currently runnable. Because `yarn test` expands every `test:*` script, use the individual verified checks until browser testing is configured.

`yarn docs` is currently broken. Its extraction step tells API Extractor to read `api-extractor.json`, but that file does not exist in the repository. Do not report generated API documentation as working until the missing configuration is added. Keep generated-file cleanup limited to `docs/api/` and `docs/temp/` so it cannot delete maintained documentation.

## Coding Conventions

### TypeScript

- TypeScript strict mode, `noImplicitAny`, `strictNullChecks`, and `noImplicitReturns` are enabled.
- The compiler targets ES2015 modules emitted as ESNext.
- Keep event names and handler signatures represented in types.
- Avoid `any` unless an implementation boundary requires it and the reason is documented.

### Formatting and linting

- Prettier uses a 100-character print width, single quotes, two-space indentation, and ES5 trailing commas.
- ESLint uses Airbnb, TypeScript, Jest, JSDoc, and Prettier rules.
- JSDoc is required for functions, classes, and methods unless a narrow existing suppression applies.
- Comments explain constraints and intent, not obvious code behavior or change history.

### Event contracts

- A class event map uses property names that match `TypedEvent` members on the class.
- `AddEvents` adds `on`, `once`, and `off`. It does not add a class-level `emit`.
- Keep `TypedEvent` members protected or private when callers must not emit them.
- In inheritance chains, extend the exported mixed class so inherited subscription overloads remain available.
- Preserve handler identity when testing or using `off`.

## Public API and Architecture

`src/index.ts` exports only `TypedEvent`, `AddEvents`, and `WithEventsDummyType`. Any addition, removal, rename, or signature change at this boundary can affect consumers and semantic versioning.

`TypedEvent` stores listeners for one typed event and emits values to them. `AddEvents` returns a subclass with typed `on`, `once`, and `off` methods that forward to the class's matching event fields. `WithEventsDummyType` is a TypeScript-only helper that describes those methods so the exported class can also be referenced as a type.

See [the architecture overview](docs/knowledge-base/architecture/ts-events-overview.md) for direct dependencies, inheritance composition, browser bundling, and key modules.

## Testing

- Jest runs through `ts-jest` in a jsdom environment configured by `jest.config.js`.
- Tests are co-located as `src/**/*.spec.ts`.
- `typed-event.spec.ts` covers persistent listeners, multiple listeners, one-time listeners, removal by reference, and emission.
- `event-mixin.spec.ts` covers subscription delegation and parent/child event inheritance.
- Add regression tests for listener lifecycle changes, event-map typing, inheritance composition, or public API behavior.
- For compile-time contracts, run `yarn transpile:validate` in addition to runtime Jest tests.

Path-scoped detail lives in [.github/instructions/testing.instructions.md](.github/instructions/testing.instructions.md).

## Code Review Priorities

1. Preserve event-name and handler-signature type safety.
2. Preserve parent and child subscription contracts across mixin inheritance.
3. Keep emission encapsulated behind class-controlled methods.
4. Check listener lifecycle behavior, especially `once` and removal by the same handler reference.
5. Treat `src/index.ts`, package entry points, and declaration output as compatibility boundaries.
6. Keep browser builds compatible with the `events` polyfill and avoid unnecessary runtime dependencies.

Path-scoped detail lives in [.github/instructions/code-review.instructions.md](.github/instructions/code-review.instructions.md).

## CI/CD

- Pull requests run `yarn test:lint` and `yarn test:coverage` in GitHub Actions.
- Pushes to `main` run `yarn build` and semantic-release.
- semantic-release analyzes Conventional Commits, publishes the public npm package, and updates configured release assets.
- Do not run semantic-release or publish locally unless the user explicitly requests a coordinated release.

Path-scoped detail lives in [.github/instructions/ci-cd.instructions.md](.github/instructions/ci-cd.instructions.md).

## Pull Requests

- Follow [docs/contributing/GIT_CONVENTIONS.md](docs/contributing/GIT_CONVENTIONS.md) for branches and Conventional Commits.
- Use [.github/skills/pr-description/SKILL.md](.github/skills/pr-description/SKILL.md) to draft the existing pull-request template from the committed diff and real test evidence.
- Call out public API, declaration, package-entry, browser compatibility, or semantic-version impact when applicable.
- Preserve the template headings and leave Generative AI disclosure choices to the author.

## Security and Public Scope

- Do not add secrets, tokens, credentials, private keys, certificates, `.env` values, or absolute local paths.
- Do not copy private issue, documentation, CI, or consumer information into this public repository.
- Do not log or publish event payloads that contain credentials or personal data.
- Keep dependency and workflow changes pinned through the repository lockfile and review package-source changes carefully.

## Maintaining This Guidance

Update this guidance when public exports, scripts, Node or Yarn requirements, test configuration, build outputs, workflows, or release behavior change.

If guidance disagrees with current source or configuration, fix the guidance rather than preserving stale assumptions.
