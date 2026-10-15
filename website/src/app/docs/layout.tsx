import type { FC, ReactNode } from 'react';
import { Banner } from 'fumadocs-ui/components/banner';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

const DocsRootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Banner id="wizard-published" variant="rainbow">
        🎉 Hyperse Wizard has been published.
      </Banner>
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions}
        sidebar={{ defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </>
  );
};

export default DocsRootLayout;
