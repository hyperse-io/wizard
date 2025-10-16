# @hyperse/wizard

A modern, type-safe CLI framework core library that provides powerful command-line tool building capabilities.

[![Build](https://img.shields.io/github/actions/workflow/status/hyperse-io/wizard/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-square&labelColor=000000)](https://github.com/hyperse-io/wizard/actions?query=workflow%3ACI)
[![Version](https://img.shields.io/npm/v/%40hyperse%2Fwizard?branch=main&label=version&logo=npm&style=flat-square&labelColor=000000)](https://www.npmjs.com/package/@hyperse/wizard)
[![Top Language](https://img.shields.io/github/languages/top/hyperse-io/wizard?style=flat-square&labelColor=000&color=blue)](https://github.com/hyperse-io/wizard/search?l=typescript)
[![License](https://img.shields.io/badge/license-GPLv3-brightgreen.svg)](https://github.com/hyperse-io/wizard/blob/main/LICENSE.md)

## ✨ Features

- 🚀 **Type Safety** - Full TypeScript support with excellent developer experience
- 🌍 **Internationalization** - Built-in multi-language support for easy localization
- 🔌 **Plugin System** - Flexible plugin architecture for feature extension
- 🎯 **Event-Driven** - Event-based design supporting async operations and error handling
- 🛠️ **Command Builder** - Intuitive command definition API with subcommand and argument parsing
- 📝 **Logging System** - Integrated logging functionality with different log levels
- 🎨 **Theme Support** - Support for colored output and theme customization
- ⚡ **High Performance** - Pipeline-based architecture for efficient command execution

## Installation

```bash
# npm
npm install --save-dev @hyperse/wizard

# yarn
yarn add --dev @hyperse/wizard

# pnpm
pnpm add --save-dev @hyperse/wizard
```

## 📚 API Reference

### createWizard(options)

Create a CLI instance.

- `options`: Configuration options (name, description, version, locale, logLevel, noColor, localeMessages, errorHandler, etc.)

### defineCommand(name, options)

Define a command.

- `name`: Command name
- `options`: Command configuration (description, flags, process, etc.)

### Wizard Class

The core CLI class provides methods such as:

- `use(plugin)`: Use a plugin
- `flag(name, options)`: Define global flags
- `interceptor(handler)`: Add global interceptor
- `errorHandler(handler)`: Set error handler
- `parse(argv?)`: Parse command line arguments

## 🔌 Plugin System

Wizard Core supports plugin extensions. You can encapsulate and register commands or features as plugins.

## 🌍 Internationalization

Supports multi-language messages and locale configuration via `locale` and `localeMessages` options.

## 📝 Logging System

Integrated logging functionality with configurable log levels.

## 🎯 Event System

Supports event-driven programming. You can listen to command execution and error events.

## 🤝 Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the [GPLv3 License](../../LICENSE.md).

## 🔗 Links

- [Project Homepage](https://github.com/hyperse-io/wizard)
- [Issue Tracker](https://github.com/hyperse-io/wizard/issues)
- [Changelog](./CHANGELOG.md)
