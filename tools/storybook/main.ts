import type { StorybookConfig } from '@storybook/vue3-vite';
import remarkGfm from 'remark-gfm';

const storybookBase = process.env['STORYBOOK_BASE'];

const config: StorybookConfig = {
  stories: ['../../src/**/*.mdx', '../../src/**/*.stories.ts'],
  core: {
    disableTelemetry: true,
  },
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      builder: {
        viteConfigPath: 'tools/vite/vite.lib.config.ts',
      },
    },
  },
  staticDirs: ['../../public', { from: '../../dist/webc', to: '/webc-bundles' }],
  viteFinal(viteConfig, { configType }) {
    if (configType === 'PRODUCTION' && storybookBase !== undefined && storybookBase.length > 0) {
      viteConfig.base = storybookBase;
    }
    return viteConfig;
  },
};

export default config;
