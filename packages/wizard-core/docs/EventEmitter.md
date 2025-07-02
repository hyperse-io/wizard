# EventEmitter with Type Safety and Auto-completion

这个 EventEmitter 实现提供了完整的类型安全和自动提示功能，让你在开发时能够获得更好的开发体验。

## 特性

- ✅ **完整的类型安全** - 所有事件名称和数据都有类型检查
- ✅ **自动提示支持** - IDE 会显示可用的事件类型
- ✅ **异步监听器支持** - 支持 async/await 监听器
- ✅ **内存泄漏检测** - 自动检测过多的监听器
- ✅ **错误处理** - 内置错误捕获和处理机制
- ✅ **链式调用** - 支持方法链式调用

## 基本用法

### 1. 使用预定义的事件映射

```typescript
import { EventEmitter } from '../src/events/index.js';
import type { WizardEventMap } from '../src/types/EventEmitter.js';

const emitter = new EventEmitter<WizardEventMap>();

// 自动提示会显示所有可用的事件类型
emitter.on('command:start', (data) => {
  // data 的类型: { command: string; args: string[] }
  console.log(`Command: ${data.command}, Args: ${data.args.join(', ')}`);
});

emitter.on('plugin:load', (data) => {
  // data 的类型: { plugin: string; version: string }
  console.log(`Plugin: ${data.plugin} v${data.version}`);
});

// 触发事件
emitter.emit('command:start', {
  command: 'build',
  args: ['--watch', '--minify'],
});
```

### 2. 创建自定义事件映射

```typescript
interface CustomEventMap {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { data: any; version: number };
}

const emitter = new EventEmitter<CustomEventMap>();

emitter.on('user:login', (data) => {
  // data 的类型: { userId: string; timestamp: number }
  console.log(`User ${data.userId} logged in`);
});

emitter.on('data:update', (data) => {
  // data 的类型: { data: any; version: number }
  console.log(`Data updated to version ${data.version}`);
});
```

### 3. 使用辅助类型

```typescript
import type { CreateEventMap } from '../src/types/EventEmitter.js';

type MyEvents = CreateEventMap<{
  'test:start': { name: string };
  'test:end': { name: string; duration: number; success: boolean };
}>;

const emitter = new EventEmitter<MyEvents>();

emitter.on('test:start', (data) => {
  // data 的类型: { name: string }
  console.log(`Test ${data.name} started`);
});
```

## API 参考

### 构造函数

```typescript
new EventEmitter<T extends EventMap>(options?: EventEmitterOptions)
```

**选项:**

- `maxListeners?: number` - 最大监听器数量 (默认: 10)
- `captureRejections?: boolean` - 是否捕获异步监听器的错误 (默认: false)

### 方法

#### `on<K extends keyof T>(event: K, listener: EventListener<T[K]>): this`

添加事件监听器。

```typescript
emitter.on('command:start', (data) => {
  console.log('Command started:', data.command);
});
```

#### `once<K extends keyof T>(event: K, listener: EventListener<T[K]>): this`

添加一次性事件监听器。

```typescript
emitter.once('wizard:ready', (data) => {
  console.log('Wizard is ready!');
});
```

#### `off<K extends keyof T>(event: K, listener: EventListener<T[K]>): this`

移除事件监听器。

```typescript
const handler = (data) => console.log(data);
emitter.on('event', handler);
emitter.off('event', handler);
```

#### `emit<K extends keyof T>(event: K, data: T[K]): boolean`

触发事件。

```typescript
emitter.emit('command:start', {
  command: 'build',
  args: ['--watch'],
});
```

#### `removeAllListeners<K extends keyof T>(event?: K): this`

移除所有监听器。

```typescript
emitter.removeAllListeners('command:start'); // 移除特定事件的所有监听器
emitter.removeAllListeners(); // 移除所有事件的监听器
```

#### `listenerCount<K extends keyof T>(event: K): number`

获取指定事件的监听器数量。

```typescript
const count = emitter.listenerCount('command:start');
```

#### `listeners<K extends keyof T>(event: K): EventListener<T[K]>[]`

获取指定事件的所有监听器。

```typescript
const listeners = emitter.listeners('command:start');
```

#### `eventNames(): (keyof T)[]`

获取所有有监听器的事件名称。

```typescript
const events = emitter.eventNames();
```

#### `setMaxListeners(n: number): this`

设置最大监听器数量。

```typescript
emitter.setMaxListeners(20);
```

#### `getMaxListeners(): number`

获取最大监听器数量。

```typescript
const max = emitter.getMaxListeners();
```

## 类型定义

### EventListener<T>

事件监听器函数类型。

```typescript
type EventListener<T = any> = (data: T) => void | Promise<void>;
```

### EventMap

事件映射接口。

```typescript
interface EventMap {
  [event: string]: any;
}
```

### 辅助类型

#### EventNames<T>

提取事件名称类型。

```typescript
type EventNames<T extends EventMap> = keyof T;
```

#### EventData<T, K>

提取事件数据类型。

```typescript
type EventData<T extends EventMap, K extends keyof T> = T[K];
```

#### CreateEventMap<T>

创建事件映射的辅助类型。

```typescript
type CreateEventMap<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};
```

## 最佳实践

### 1. 定义清晰的事件映射

```typescript
interface AppEvents {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { data: any; version: number };
  error: { message: string; code: number };
}
```

### 2. 使用命名空间

```typescript
interface Events {
  'user:login': { userId: string };
  'user:logout': { userId: string };
  'data:create': { id: string; data: any };
  'data:update': { id: string; data: any };
  'data:delete': { id: string };
}
```

### 3. 处理异步监听器

```typescript
emitter.on('data:update', async (data) => {
  try {
    await saveToDatabase(data);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
});
```

### 4. 错误处理

```typescript
emitter.on('error', (data) => {
  console.error('Event error:', data.message);
  // 记录错误或发送到监控服务
});
```

### 5. 内存管理

```typescript
// 在组件卸载时清理监听器
const cleanup = () => {
  emitter.removeAllListeners();
};

// 或者只移除特定事件的监听器
const cleanup = () => {
  emitter.removeAllListeners('user:login');
};
```

## 与 Node.js EventEmitter 的区别

这个实现与 Node.js 的 EventEmitter 有以下区别：

1. **类型安全** - 提供完整的 TypeScript 类型支持
2. **自动提示** - IDE 会显示可用的事件类型
3. **更简洁的 API** - 移除了不必要的复杂性
4. **更好的错误处理** - 内置异步错误处理
5. **内存泄漏检测** - 自动检测过多的监听器

## 示例

查看 `examples/event-emitter-usage.ts` 文件获取完整的使用示例。
