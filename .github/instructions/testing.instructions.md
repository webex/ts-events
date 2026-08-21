---
applyTo: "src/**/*.spec.ts"
name: ts-events Tests
description: Use when writing or reviewing co-located Jest tests for typed events and mixin behavior.
---

# Testing Instructions

## Framework and location

- Jest runs through `ts-jest` in the environment configured by `jest.config.js`. Check `package.json` and `jest.config.js` instead of pinning tool versions in guidance.
- Keep tests next to source as `src/**/*.spec.ts`.
- Use `yarn test:unit` for focused runtime feedback and `yarn test:coverage` for the pull-request test command.
- Run `yarn transpile:validate` when changing generic constraints, overloads, exported types, or inheritance composition.

## Test patterns

- Name the top-level `describe` after the class or behavior under test.
- Group listener methods or inheritance scenarios in nested `describe` blocks when it improves clarity.
- Use behavior-focused `it('should ...')` descriptions.
- Register listeners before triggering the class method or `TypedEvent.emit`.
- Assert handler arguments and invocation counts.
- Keep tests independent and avoid shared listener state that survives between cases.
- For `off`, store the handler and remove that same function reference.

## Required coverage by change type

- `TypedEvent` listener changes: persistent listeners, multiple listeners, `once`, `off`, and emitted argument forwarding.
- `AddEvents` changes: delegation for `on`, `once`, and `off`.
- Inheritance changes: subscriptions to both inherited and newly introduced events.
- Encapsulation changes: compile-time evidence that callers cannot emit through the mixed class API when its event members are non-public.
- Public type changes: positive and negative compile-time cases plus runtime coverage where behavior also changes.

## Browser scripts

`yarn test` expands all `test:*` scripts, including the browser integration scripts. Karma and browser launcher packages are installed, but the repository has no Karma configuration file, so those browser tests are not currently runnable. Do not claim browser integration coverage or report the full suite as passing until browser testing is configured and observed.
