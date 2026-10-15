import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { remarkNpm } from 'fumadocs-core/mdx-plugins/remark-npm';
import { remarkSteps } from 'fumadocs-core/mdx-plugins/remark-steps';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { remarkAutoTypeTable } from 'fumadocs-typescript';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkAutoTypeTable, remarkSteps, remarkNpm],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          throws: false,
          twoslashOptions: {
            handbookOptions: {
              // These docs contain sample snippets that intentionally omit
              // required props (e.g. `description`/`version`). Nextra ignored
              // them; we keep rendering instead of failing the build, and
              // surface them as warnings so the content can be fixed later.
              noErrorValidation: true,
            },
          },
          onTwoslashError: (error, code, lang) => {
            console.warn(
              `\n[twoslash] ${lang} FAILED:\n${String(
                (error as Error)?.message ?? error
              ).slice(0, 600)}\n`
            );
            return undefined;
          },
        }),
      ],
    },
  },
});
