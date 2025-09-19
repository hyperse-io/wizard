# @hyperse/wizard-plugin-version

## 1.0.5

### Patch Changes

- Updated dependencies [[`296c5b2`](https://github.com/hyperse-io/wizard/commit/296c5b258c7c274308c5628b3693b089f2937c7c)]:
  - @hyperse/wizard@1.0.5

## 1.0.4

### Patch Changes

- [#15](https://github.com/hyperse-io/wizard/pull/15) [`cace114`](https://github.com/hyperse-io/wizard/commit/cace114783731b6f5e2ec6c2994ea9df6935dc6c) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - Improve environment support and CLI UX.
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

- Updated dependencies [[`e57b630`](https://github.com/hyperse-io/wizard/commit/e57b630eb8aaff52e994adb2f990cf634a6afde0), [`cace114`](https://github.com/hyperse-io/wizard/commit/cace114783731b6f5e2ec6c2994ea9df6935dc6c)]:
  - @hyperse/wizard@1.0.4

## 1.0.3

### Patch Changes

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
