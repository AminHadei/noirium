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
    app.component(withPrefix('CheckInput', options?.prefix), Components.CheckInput);
    app.component(withPrefix('DateInput', options?.prefix), Components.DateInput);
    app.component(withPrefix('DatePicker', options?.prefix), Components.DatePicker);
    app.component(withPrefix('PrimaryButton', options?.prefix), Components.PrimaryButton);
    app.component(withPrefix('Toast', options?.prefix), Components.Toast);
    app.component(withPrefix('ToastContainer', options?.prefix), Components.ToastContainer);
    app.component(withPrefix('ToastProvider', options?.prefix), Components.ToastProvider);
  },
};
