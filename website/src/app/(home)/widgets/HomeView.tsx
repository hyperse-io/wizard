'use client';

import type { FC } from 'react';
import { Link } from 'nextra-theme-docs';
import { Feature, Features } from '@/components/Features';
import { Icon } from '@iconify/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from './page.module.css';
import './page.css';

const features = [
  {
    title: 'Lightweight',
    icon: 'material-icon-theme:auto-light',
    description:
      'Minimal bundle size with zero dependencies, optimized for fast startup and efficient memory usage in production environments',
  },
  {
    title: 'Type Safety',
    icon: 'streamline-stickies-color:safety-duo',
    description:
      'Built with TypeScript from the ground up, providing comprehensive type checking, intelligent autocomplete, and compile-time error detection for robust CLI development',
  },
  {
    title: 'i18n',
    icon: 'material-icon-theme:folder-i18n',
    description:
      'Native multi-language support with flexible i18n system, enabling easy localization of commands, help text, and error messages for global user bases',
  },
  {
    title: 'Plugin System',
    icon: 'material-icon-theme:folder-plugin-open',
    description:
      'Extensible plugin architecture with official plugins for help, version, error handling, and custom plugin development for seamless feature integration',
  },
  {
    title: 'Event-Driven',
    icon: 'carbon:ibm-cloud-event-notification',
    description:
      'Powerful event-based architecture supporting asynchronous operations, comprehensive error handling, and reactive command execution patterns',
  },
  {
    title: 'Chainable APIs',
    icon: 'material-icon-theme:apiblueprint',
    description:
      'Intuitive command definition API with subcommand support, type inference, and chainable methods for building complex CLI applications',
  },
];

export const HomeView: FC = () => {
  return (
    <div className="mb-24">
      <div className="grid grid-cols-1 gap-12 px-4 py-24 md:grid-cols-2 md:py-32">
        <div className="flex flex-col items-center justify-evenly gap-4 md:items-start">
          <div className="text-center text-4xl font-bold md:text-left md:text-5xl lg:text-6xl">
            <h1 className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent dark:from-blue-300 dark:to-blue-500">
              Wizard
            </h1>
            A modern, Type-safe CLI framework core library
          </div>
          <p className="subtitle mt-4 w-fit md:w-auto">
            <Link className={styles.cta} href="/docs">
              Get started <span>→</span>
            </Link>
          </p>
        </div>
        <div
          className={`${styles.right_layout} order-first hidden md:order-none md:block`}
        >
          <div className={`${styles.image_bg_dark} hidden dark:block`} />
          <div className={`${styles.image_bg} block dark:hidden`} />
          <DotLottieReact
            src="/wizard/assets/lottie/niu.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      <div className="px-4">
        <Features>
          {features.map((feature, index) => (
            <Feature
              key={index}
              index={index}
              id="highlighting-card"
              className="space-y-4"
            >
              <div className="flex size-10 items-center justify-center rounded-sm bg-transparent dark:bg-slate-500/10">
                <Icon icon={feature.icon} className="size-6" />
              </div>
              <h4 className="flex items-center gap-2 text-xl font-bold">
                {feature.title}
              </h4>
              <p className="text-md text-gray-500">{feature.description}</p>
            </Feature>
          ))}
        </Features>
      </div>
    </div>
  );
};
