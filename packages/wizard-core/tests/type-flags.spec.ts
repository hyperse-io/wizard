import { typeFlag } from 'type-flag';

describe('cli', () => {
  it('should be able to parse the cli', () => {
    function Foo(value: string) {
      const [propertyName, propertyValue] = value.split('=');

      return {
        [propertyName]: propertyValue || true,
      };
    }
    const argv = [
      'build',
      'evolve',
      'mini',
      '-c',
      'webpack',
      '--compiler',
      'rspack',
      'test',
      '--foo.a=42',
      '--foo.b=bar',
      '--',
    ];
    const parsed = typeFlag(
      {
        compiler: {
          type: String,
          description: '',
          default: {},
          alias: 'c',
        },
        foo: {
          description: '',
          type: [Foo],
          default: {},
          alias: 'f',
        },
      },
      argv
    );
    const { _: args, flags, unknownFlags } = parsed;
    console.log(args);
    console.log(parsed._[4]);
    console.log(flags);
    console.log(unknownFlags);
    expect(true).toBe(true);
  });
});
