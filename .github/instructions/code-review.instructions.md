---
applyTo: "src/**/*.ts,README.md,AGENTS.md,docs/knowledge-base/**/*.md"
name: ts-events Code Review
description: Use when reviewing source, public event contracts, examples, or architecture guidance.
---

# Code Review Instructions

## Priorities

1. Event contracts preserve compile-time checks for event names and handler arguments.
2. Parent and child classes retain their subscription APIs through mixin inheritance.
3. Emission remains controlled by the owning class rather than exposed by `AddEvents`.
4. Listener registration, one-time invocation, and removal by handler reference remain correct.
5. Changes to `src/index.ts`, exported signatures, package entry points, or declaration output include compatibility and semantic-version analysis.
6. Browser builds continue to resolve the internal `events` dependency through the configured polyfill.

## Checks

- Event-map keys match the corresponding `TypedEvent` member names.
- Event members use the narrowest visibility compatible with intended subclass emission.
- `AddEvents` delegates only to valid `TypedEvent` fields and does not add a public class-level `emit`.
- Inheritance changes extend the mixed parent value and preserve both parent and child event overloads.
- New listener behavior has Jest coverage. Type-contract changes also run `yarn transpile:validate`.
- `off` tests and callers retain the same handler reference used by `on`.
- Public export changes are intentional and documented.
- JSDoc remains complete where ESLint requires it. Comments explain non-obvious constraints rather than restating code.
- Documentation claims are verified against source, tests, package metadata, build configuration, and release configuration.
- No secrets, credentials, private URLs, certificates, `.env` values, or local absolute paths appear in the diff.
