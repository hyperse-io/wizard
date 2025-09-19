---
"@hyperse/wizard-plugin-error": patch
"@hyperse/wizard-plugin-help": patch
"@hyperse/wizard": patch
---

feat: Enhance Wizard API and command context capabilities

- Support invoking commands by string name to simplify integration and usage.
- Add a context loader and command context retrieval for consistent command execution.
- Improve helpers for command parsing/validation, built-in flag handling, and command tree search.
- Update Help and Error plugins to align with the new API; refine usage/commands/subcommands rendering.