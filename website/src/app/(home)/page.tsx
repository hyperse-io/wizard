import type { FC } from 'react';
import type { Metadata } from 'next';
import { HomeView } from './widgets/HomeView';

export const metadata: Metadata = {
  description:
    'Build fast, customizable, and content-rich websites with Nextra. Powered by Next.js, it offers seamless Markdown support, customizable themes, file conventions, and easy integration with MDX, making it perfect for documentation, blogs, and static websites.',
};

const IndexPage: FC = () => {
  return (
    <section className="container mx-auto max-w-7xl">
      <HomeView />
    </section>
  );
};

export default IndexPage;
