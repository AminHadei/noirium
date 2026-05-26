import type { App } from 'vue';

import type { LibVueAppOptions } from './types';
import * as Components from './ui';

const withPrefix = (name: string, prefix?: string): string => `${prefix ?? ''}${name}`;

export { config } from '../config';

export default {
  install(app: App, options?: LibVueAppOptions): void {
    app.component(withPrefix('BaseBadge', options?.prefix), Components.BaseBadge);
    app.component(withPrefix('BaseDialog', options?.prefix), Components.BaseDialog);
    app.component(withPrefix('BaseDropdown', options?.prefix), Components.BaseDropdown);
    app.component(withPrefix('PrimaryButton', options?.prefix), Components.PrimaryButton);
  },
};
