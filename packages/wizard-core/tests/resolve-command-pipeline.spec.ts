import { describe, expect, it } from 'vitest';
import { createCommand } from '../src/core/Command.js';
import { CommandNotFoundError } from '../src/errors/CommandNotFoundError.js';
import { resolveCommandPipeline } from '../src/helpers/helper-resolve-command-pipeline.js';
import type { Command } from '../src/types/type-command.js';

describe('resolveCommandPipeline', () => {
  it('should return the command and its parent chain in correct order', () => {
    // Create parent and child commands
    const parent = createCommand('parent', {
      description: () => 'parent command',
    });
    const child = createCommand('child', {
      description: () => 'child command',
    });

    const childA = createCommand('childA', {
      description: () => 'childA command',
    });

    const childA_1 = createCommand('childA_1', {
      description: () => 'childA_1 command',
    });
    const childA_2 = createCommand('childA_2', {
      description: () => 'childA_2 command',
    });

    const childA_1_1 = createCommand('childA_1_1', {
      description: () => 'childA_1_1 command',
    });
    const childA_1_2 = createCommand('childA_1_2', {
      description: () => 'childA_1_2 command',
    });

    const childB = createCommand('childB', {
      description: () => 'childB command',
    });

    parent.setSubCommands([child]);
    child.setParentCommand(parent);
    child.setSubCommands([childA, childB]);
    childA.setParentCommand(child);
    childB.setParentCommand(child);

    childA.setSubCommands([childA_1, childA_2]);
    childA_1.setParentCommand(childA);

    childA_1.setSubCommands([childA_1_1, childA_1_2]);
    childA_1_1.setParentCommand(childA_1);
    childA_1_2.setParentCommand(childA_1);

    // Command map
    const commandMap = {
      parent,
      child,
      childA,
      childA_1,
      childA_1_1,
      childA_1_2,
      childA_2,
      childB,
    };

    // Should return [parent, child]
    const result_childA_1_2 = resolveCommandPipeline(
      'en',
      'childA_1_2' as any,
      commandMap
    );
    expect(result_childA_1_2).toHaveLength(5);
    expect(result_childA_1_2[0]).toBe(parent);
    expect(result_childA_1_2[1]).toBe(child);
    expect(result_childA_1_2[2]).toBe(childA);
    expect(result_childA_1_2[3]).toBe(childA_1);
    expect(result_childA_1_2[4]).toBe(childA_1_2);

    const result_childB = resolveCommandPipeline(
      'en',
      'childB' as any,
      commandMap
    );

    expect(result_childB).toHaveLength(3);
    expect(result_childB[0]).toBe(parent);
    expect(result_childB[1]).toBe(child);
    expect(result_childB[2]).toBe(childB);

    try {
      resolveCommandPipeline('en', 'childNull' as any, commandMap);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CommandNotFoundError);
      expect(error.message).toBe('Command childNull not found.');
    }
  });

  it('should return only the command if it has no parent', () => {
    const single = createCommand<string>('single', {
      description: () => 'single command',
    });
    const commandMap: Record<string, Command<string>> = { single };
    const result = resolveCommandPipeline(
      'en',
      'single' as any,
      commandMap as any
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(single);
  });

  it('should throw CommandNotFoundError if command does not exist', () => {
    const commandMap: Record<any, Command<any>> = {};
    expect(() => {
      resolveCommandPipeline('en', 'notfound' as any, commandMap as any);
    }).toThrow(CommandNotFoundError);
  });

  it('should support RootType as name', () => {
    // Simulate RootType usage
    const rootSymbol = Symbol.for('Wizard.Root');
    const root = createCommand<any>(rootSymbol, {
      description: () => 'root command',
    });
    const commandMap: Record<any, Command<any>> = {
      [rootSymbol as any]: root,
    };
    const result = resolveCommandPipeline(
      'en',
      rootSymbol as any,
      commandMap as any
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(root);
  });
});
