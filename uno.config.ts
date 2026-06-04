import { resolve } from 'node:path';

import { createRemToPxProcessor } from '@unocss/preset-wind4/utils';
import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerCompileClass,
  type SourceCodeTransformer,
} from 'unocss';

import { iconCollections } from './tools/uno/icons';

const __dirname = import.meta.dirname;

// Generate safelist for dynamic flag icon classes
const formInputSafelist = ['form-main-input'];

const config = {
  presets: [
    presetWind4({
      preflights: {
        reset: false,
        property: {
          parent: false,
        },
        theme: {
          process: createRemToPxProcessor(),
        },
      },
    }),
    presetIcons({
      collections: iconCollections,
      extraProperties: {
        display: 'block',
        'vertical-align': 'middle',
      },
      customizations: {
        customize(props) {
          // Preserve stroke attributes
          props.width = props.width ?? '1em';
          props.height = props.height ?? '1em';
          return props;
        },
      },
    }),
  ],
  content: {
    pipeline: {
      include: [resolve(__dirname, 'src/features/**/*.{vue,ts}')],
      exclude: [resolve(__dirname, '**/composables/**/*.ts')],
    },
  },
  safelist: [...formInputSafelist],
  shortcuts: {
    'line-height-150': 'leading-[150%]',
    'line-height-115': 'leading-[115%]',
    'line-height-normal': 'leading-[100%]',
    'form-main-input':
      'border border-border hover:border-border-hover focus-visible:outline-none focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all',
  },
  theme: {
    colors: {
      current: 'currentColor',
      primary: '#171717',
      'text-darker': '#0A0A0A',
      'text-dark': '#525252',
      'text-light': '#A3A3A3',
      border: '#E5E5E5',
      'border-hover': '#737373',
      surface: '#F5F5F5',
      'surface-muted': '#FAFAFA',
      'surface-strong': '#E5E5E5',
      destructive: '#404040',
      // Status palette — chromatic exceptions for BaseBadge and Toast only
      'status-red': '#DB2C00',
      'status-red-strong': '#C10007',
      'status-badge-red-bg': '#FEE2E2',
      'status-badge-red-text': '#B91C1C',
      'status-green': '#00816E',
      'status-badge-green-bg': '#D1FAE5',
      'status-badge-green-text': '#047857',
      'status-blue': '#2563EB',
      'status-yellow': '#F59E0B',
    },
    font: {
      noto: 'Noto Sans',
      figtree: 'Figtree',
    },
  },
  transformers: [] as SourceCodeTransformer[],
};

if (process.env['NODE_ENV'] === 'production' && process.env['MODE'] !== 'test') {
  config.transformers.push(transformerCompileClass());
}

export default defineConfig(config);
