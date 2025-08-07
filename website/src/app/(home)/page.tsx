import type { FC } from 'react';
import type { Metadata } from 'next';
import { HomeView } from './widgets/HomeView';

export const metadata: Metadata = {
  title: 'Wizard',
  description:
    'Wizard is a CLI framework for building modern, efficient, and scalable command-line applications.',
};

const IndexPage: FC = () => {
  return (
    <section className="container mx-auto max-w-7xl">
      <HomeView />
    </section>
  );
};

export default IndexPage;
