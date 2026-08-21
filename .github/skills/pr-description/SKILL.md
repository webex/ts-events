---
name: pr-description
description: Draft accurate ts-events pull-request descriptions from the repository template, committed changes, and observed test evidence.
---

# PR Description

Create a concise pull-request description that helps reviewers understand the change and verify its event, type, runtime, and compatibility effects.

## Sources

Read these before drafting:

1. `.github/PULL_REQUEST_TEMPLATE.md`
2. The complete committed diff against the pull-request base branch
3. All branch commits
4. Test output supplied by the author or produced in the current session
5. Public issues or documentation linked by the author

Repository files and observed results are authoritative. Do not invent motivation, test evidence, issue links, screenshots, browser coverage, or compatibility claims.

## Workflow

1. Confirm the base branch. Use `main` when no other base is specified.
2. Review the complete branch diff, not only the latest commit.
3. Check `git status`. If uncommitted changes exist, warn the author and exclude them from the pull-request description until committed.
4. Identify the change type and effects on event contracts, inheritance, emission access, listener lifecycle, public exports, bundles, declarations, runtime dependencies, and release behavior.
5. Ask what manual testing was performed. Request the scenario, runtime or browser when relevant, and result. If no manual testing was needed, ask the author to confirm why.
6. Ask only for facts that cannot be derived, such as a public issue link, screenshots, or the Generative AI disclosure category.
7. Produce the completed repository template without removing headings or policy checkboxes. Remove or replace private-only references rather than reproducing them.

## Description rules

- Under `Description`, start with one to three bullets explaining what changed and why.
- Add a short `Testing` subsection under `Description` with only commands and manual checks that actually ran.
- Describe behavior and developer outcomes instead of listing changed files.
- Call out breaking changes, public API impact, declaration changes, browser compatibility, dependency changes, or migration steps only when supported by the diff.
- Preserve the `This change implements...`, breaking-change, certification, and Generative AI sections.
- Keep checkboxes unchecked when evidence or author input is missing.
- Never mark the test certification checkbox without evidence.
- Never select a Generative AI disclosure category for the author.
- Do not add a dedicated risk section.
- Use only public links in this public repository.

## Output

Return one Markdown block that can be pasted into GitHub.

After the block, list unresolved author questions separately. Do not put `TBD` placeholders in an otherwise final description.
