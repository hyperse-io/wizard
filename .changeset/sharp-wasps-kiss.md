---
"@hyperse/wizard-plugin-version": patch
"@hyperse/wizard-plugin-loader": patch
"@hyperse/wizard-plugin-error": patch
"@hyperse/wizard-plugin-help": patch
"@hyperse/wizard": patch
---

Improve environment support and CLI UX.

- feat
  - @hyperse/wizard: builtin environment variable support.
  - @hyperse/wizard-plugin-loader: load and resolve env files (.env, .env.local when present).
  - @hyperse/wizard-plugin-help: clearer help rendering for commands/usage/subcommands/global options.
  - @hyperse/wizard-plugin-version: graceful version resolution when package metadata is missing.

- fix
  - @hyperse/wizard: strengthen event and plugin typings.
  - @hyperse/wizard-plugin-error: align internal typings with core.

- docs
  - Refreshed core API docs and website config related to the new env support.
