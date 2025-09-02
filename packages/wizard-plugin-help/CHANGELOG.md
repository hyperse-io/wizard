# @hyperse/wizard-plugin-help

## 1.0.3

### Patch Changes

- [#11](https://github.com/hyperse-io/wizard/pull/11) [`370634b`](https://github.com/hyperse-io/wizard/commit/370634b2c6a50cc75ba6636a3aa1af5871b9a12f) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: 🔄 update wizard package dependencies and improve flag handling
  - Bump @hyperse/translator version to ^1.3.0.
  - Add PlainMessageRegex constant for message validation.
  - Refactor log level handling in helper functions to use string keys.
  - Enhance locale message formatting for log level options.
  - Add tests for built-in flags functionality in the wizard package.

- Updated dependencies [[`370634b`](https://github.com/hyperse-io/wizard/commit/370634b2c6a50cc75ba6636a3aa1af5871b9a12f)]:
  - @hyperse/wizard@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [[`2cab765`](https://github.com/hyperse-io/wizard/commit/2cab765cb78f5fbbd6bb1d3f04ea4063aebc3da8)]:
  - @hyperse/wizard@1.0.2

## 1.0.1

### Patch Changes

- [#6](https://github.com/hyperse-io/wizard/pull/6) [`b884d02`](https://github.com/hyperse-io/wizard/commit/b884d02cebe63a2dbeace4a44c25bc8bfcfb7c03) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - ### Core Framework Improvements 🔧
  - feat: enhance command processing with improved error handling
  - refactor: optimize type definitions for better developer experience
  - perf: improve performance of command execution and validation

  ### Plugin Enhancements 🔌
  - feat: add new configuration options to all plugins for better customization
  - refactor: improve plugin message formatting and internationalization
  - fix: resolve plugin loading issues and enhance error reporting

  ### Developer Experience 🛠️
  - docs: update API documentation with better examples and usage patterns
  - test: enhance test coverage for critical functionality
  - chore: improve build process and development workflow

  ### Bug Fixes 🐞
  - fix: resolve type safety issues in command definitions
  - fix: improve error handling in plugin system
  - fix: address internationalization inconsistencies

- Updated dependencies [[`b884d02`](https://github.com/hyperse-io/wizard/commit/b884d02cebe63a2dbeace4a44c25bc8bfcfb7c03)]:
  - @hyperse/wizard@1.0.1

## 1.0.0

### Major Changes

- [#4](https://github.com/hyperse-io/wizard/pull/4) [`60e5920`](https://github.com/hyperse-io/wizard/commit/60e592057bf1ffa3690b5ed06874507c26389105) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: update type definitions

- [#3](https://github.com/hyperse-io/wizard/pull/3) [`d40c974`](https://github.com/hyperse-io/wizard/commit/d40c97417bbad7ea3a0a0aeb24fdc831075c84ce) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - ## What's Changed

  ### Dependencies & Core Updates 🔧
  - chore: update `@hyperse/logger` from ^1.1.3 to ^1.1.7
  - chore: update `@hyperse/logger-plugin-stdout` from ^1.0.7 to ^1.0.11
  - refactor: improve command processing architecture with better type safety
  - feat: add `CommandProcessNotFoundError` for better error reporting
  - refactor: enhance command builder types and type definitions
  - refactor: update locale messages and improve i18n support

  ### Plugin Improvements 🔌
  - feat: add `noColor` option to `createErrorPlugin` for improved error display
  - refactor: enhance error message formatting and internationalization
  - refactor: update help plugin messages for better clarity and consistency
  - refactor: improve version plugin messages for better internationalization
  - refactor: enhance loader plugin messages for better user experience

  ### Testing & Quality Assurance 🧪
  - test: improve test coverage across all packages for better reliability
  - test: enhance error handling scenarios in error plugin tests
  - test: improve plugin validation and behavior tests
  - test: enhance plugin loading test scenarios
  - refactor: remove redundant test utilities and improve test organization

  ### Documentation 📖
  - docs: update core API documentation pages for better clarity
  - docs: improve getting started guide with better examples
  - docs: enhance custom plugin development documentation
  - docs: update website documentation and improve user experience

  ### Bug Fixes 🐞
  - fix: improve code structure and remove deprecated patterns
  - fix: enhance error handling and type safety across all components
  - fix: resolve internationalization inconsistencies in plugin messages

  This release focuses on improving the overall stability, type safety, and developer experience of the Wizard CLI framework while maintaining backward compatibility.

### Patch Changes

- Updated dependencies [[`60e5920`](https://github.com/hyperse-io/wizard/commit/60e592057bf1ffa3690b5ed06874507c26389105), [`d40c974`](https://github.com/hyperse-io/wizard/commit/d40c97417bbad7ea3a0a0aeb24fdc831075c84ce)]:
  - @hyperse/wizard@1.0.0
