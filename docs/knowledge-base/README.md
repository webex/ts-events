# Knowledge Base

Public, repository-local architecture and onboarding guidance for `@webex/ts-events`. Read this index before broad searches about event composition, inheritance, dependency roles, browser packaging, or release behavior.

| Link | What you get |
|---|---|
| [architecture/ts-events-overview.md](architecture/ts-events-overview.md) | Event model, mixin inheritance, emission control, direct dependencies, runtime boundaries, source map, and release behavior |
| [README.md](../../README.md) | Package motivation, usage pattern, tradeoffs, and development setup |
| [src/index.ts](../../src/index.ts) | Authoritative public source exports |

Generated API documentation belongs under `docs/api/`. Temporary API-extractor output belongs under `docs/temp/`. Cleanup commands must preserve this knowledge base and `docs/contributing/`.

Keep articles short and verify implementation details against current source, tests, package metadata, and configuration. Use only public links and publicly verifiable relationships.

New articles belong under `architecture/` or `questions/` and must be linked here. Agents should ask before capturing additional repeatable knowledge.
