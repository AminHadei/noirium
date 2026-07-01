import type { App, Component } from 'vue';

import type { LibVueAppOptions } from './types';
import * as Components from './ui';

const withPrefix = (name: string, prefix?: string): string => `${prefix ?? ''}${name}`;

const isComponent = (value: unknown): value is Component =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

export { config } from '../config';

export default {
  install(app: App, options?: LibVueAppOptions): void {
    for (const [name, component] of Object.entries(Components)) {
      if (isComponent(component)) {
        app.component(withPrefix(name, options?.prefix), component);
      }
    }
  },
};
