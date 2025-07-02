import { EventEmitter } from '../src/events/index.js';
import type { CreateEventMap } from '../src/types/typeEvent.js';

/**
 * @description
 * Example event map for wizard events.
 *
 * @docsCategory types
 * @docsPage EventEmitter
 */
export interface WizardEventMap {
  'command:start': { command: string; args: string[] };
  'command:end': { command: string; result: any; duration: number };
  'plugin:load': { plugin: string; version: string };
  'plugin:error': { plugin: string; error: Error };
  'wizard:ready': { version: string; plugins: string[] };
  'wizard:error': { error: Error; context?: string };
}

// 示例 1: 使用预定义的 WizardEventMap
const wizardEmitter = new EventEmitter<WizardEventMap>();

// 这里会有自动提示，显示所有可用的事件类型
wizardEmitter.on('command:start', (data) => {
  // data 的类型会自动推断为 { command: string; args: string[] }
  console.log(
    `Command started: ${data.command} with args: ${data.args.join(', ')}`
  );
});

wizardEmitter.on('plugin:load', (data) => {
  // data 的类型会自动推断为 { plugin: string; version: string }
  console.log(`Plugin loaded: ${data.plugin} v${data.version}`);
});

wizardEmitter.on('wizard:error', (data) => {
  // data 的类型会自动推断为 { error: Error; context?: string }
  console.error(`Wizard error: ${data.error.message}`, data.context);
});

// 触发事件时也会有类型检查
wizardEmitter.emit('command:start', {
  command: 'build',
  args: ['--watch', '--minify'],
});

wizardEmitter.emit('plugin:load', {
  plugin: 'typescript',
  version: '5.0.0',
});

// 示例 2: 创建自定义事件映射
interface CustomEventMap {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { data: any; version: number };
  error: { message: string; code: number };
}

const customEmitter = new EventEmitter<CustomEventMap>();

// 自动提示会显示自定义的事件类型
customEmitter.on('user:login', (data) => {
  // data 的类型: { userId: string; timestamp: number }
  console.log(`User ${data.userId} logged in at ${new Date(data.timestamp)}`);
});

customEmitter.on('data:update', (data) => {
  // data 的类型: { data: any; version: number }
  console.log(`Data updated to version ${data.version}`);
});

// 示例 3: 使用 CreateEventMap 辅助类型
type MyEvents = CreateEventMap<{
  'test:start': { name: string };
  'test:end': { name: string; duration: number; success: boolean };
  error: { code: number; message: string };
}>;

const testEmitter = new EventEmitter<MyEvents>();

testEmitter.on('test:start', (data) => {
  // data 的类型: { name: string }
  console.log(`Test ${data.name} started`);
});

testEmitter.on('test:end', (data) => {
  // data 的类型: { name: string; duration: number; success: boolean }
  console.log(
    `Test ${data.name} ended in ${data.duration}ms (${data.success ? 'PASS' : 'FAIL'})`
  );
});

// 示例 4: 使用 once 方法
wizardEmitter.once('wizard:ready', (data) => {
  // 这个监听器只会执行一次
  console.log(
    `Wizard ready with version ${data.version} and plugins: ${data.plugins.join(', ')}`
  );
});

// 示例 5: 错误处理
wizardEmitter.on('wizard:error', (data) => {
  console.error('Wizard error:', data.error.message);
  if (data.context) {
    console.error('Context:', data.context);
  }
});

// 示例 6: 获取监听器信息
console.log('Active events:', wizardEmitter.eventNames());
console.log(
  'Command start listeners:',
  wizardEmitter.listenerCount('command:start')
);

// 示例 7: 移除监听器
const errorHandler = (data: { error: Error; context?: string }) => {
  console.error('Custom error handler:', data.error.message);
};

wizardEmitter.on('wizard:error', errorHandler);
wizardEmitter.off('wizard:error', errorHandler); // 移除特定的监听器

// 示例 8: 异步监听器
wizardEmitter.on('plugin:load', async (data) => {
  // 异步监听器也支持
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log(`Plugin ${data.plugin} loaded asynchronously`);
});

// 示例 9: 设置最大监听器数量
wizardEmitter.setMaxListeners(20);

// 示例 10: 批量移除监听器
wizardEmitter.removeAllListeners('command:start'); // 移除特定事件的所有监听器
wizardEmitter.removeAllListeners(); // 移除所有事件的监听器

console.log('EventEmitter examples completed!');
