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
    title: 'Type Safety',
    icon: 'ant-design:safety-outlined',
    description:
      'Built with TypeScript from the ground up, providing comprehensive type checking, intelligent autocomplete, and compile-time error detection for robust CLI development',
  },
  {
    title: 'Internationalization',
    icon: 'fluent-mdl2:locale-language',
    description:
      'Native multi-language support with flexible i18n system, enabling easy localization of commands, help text, and error messages for global user bases',
  },
  {
    title: 'Plugin System',
    icon: 'clarity:plugin-line',
    description:
      'Extensible plugin architecture that allows seamless integration of custom functionality, third-party tools, and modular feature development',
  },
  {
    title: 'Event-Driven',
    icon: 'carbon:ibm-cloud-event-notification',
    description:
      'Powerful event-based architecture supporting asynchronous operations, comprehensive error handling, and reactive command execution patterns',
  },
  {
    title: 'Logging System',
    icon: 'carbon:cloud-logging',
    description:
      'Built-in structured logging with multiple log levels, customizable output formats, and seamless integration with external logging services',
  },
  {
    title: 'High Performance',
    icon: 'eos-icons:performance',
    description:
      'Optimized pipeline-based execution engine with minimal overhead, efficient memory usage, and blazing-fast command processing',
  },
];

export const HomeView: FC = () => {
  return (
    <div className="mb-24">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col justify-evenly gap-4 py-48">
          <h1 className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-6xl font-bold text-transparent">
            Hyperse Wizard is a modern, type-safe CLI framework core library
          </h1>
          <p className="subtitle">
            <Link className={styles.cta} href="/docs">
              Get started <span>→</span>
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <DotLottieReact
            className="w-full"
            src="/wizard/assets/lottie/niu.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      <div>
        <Features>
          {features.map((feature, index) => (
            <Feature
              key={index}
              index={index}
              id="highlighting-card"
              className="space-y-4"
            >
              <h4 className="flex items-center gap-2 text-2xl font-bold">
                <Icon icon={feature.icon} className="text-primary" />
                {feature.title}
              </h4>
              <p className="text-xl text-gray-500">{feature.description}</p>
            </Feature>
          ))}
        </Features>
      </div>
    </div>
  );
};
