---
"@hyperse/wizard-plugin-version": patch
"@hyperse/wizard-plugin-loader": patch
"@hyperse/wizard-plugin-error": patch
"@hyperse/wizard-plugin-help": patch
"@hyperse/wizard": patch
---

## What's Changed

### Dependencies & Core Updates 🔧

* chore: update `@hyperse/logger` from ^1.1.3 to ^1.1.7
* chore: update `@hyperse/logger-plugin-stdout` from ^1.0.7 to ^1.0.11
* refactor: improve command processing architecture with better type safety
* feat: add `CommandProcessNotFoundError` for better error reporting
* refactor: enhance command builder types and type definitions
* refactor: update locale messages and improve i18n support

### Plugin Improvements 🔌

* feat: add `noColor` option to `createErrorPlugin` for improved error display
* refactor: enhance error message formatting and internationalization
* refactor: update help plugin messages for better clarity and consistency
* refactor: improve version plugin messages for better internationalization
* refactor: enhance loader plugin messages for better user experience

### Testing & Quality Assurance 🧪

* test: improve test coverage across all packages for better reliability
* test: enhance error handling scenarios in error plugin tests
* test: improve plugin validation and behavior tests
* test: enhance plugin loading test scenarios
* refactor: remove redundant test utilities and improve test organization

### Documentation 📖

* docs: update core API documentation pages for better clarity
* docs: improve getting started guide with better examples
* docs: enhance custom plugin development documentation
* docs: update website documentation and improve user experience

### Bug Fixes 🐞

* fix: improve code structure and remove deprecated patterns
* fix: enhance error handling and type safety across all components
* fix: resolve internationalization inconsistencies in plugin messages

This release focuses on improving the overall stability, type safety, and developer experience of the Wizard CLI framework while maintaining backward compatibility.
