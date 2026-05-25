import styles from 'virtual:core-styles';
import { defineCustomElement } from 'vue';

import { config } from '@/config';
import { PrimaryButton } from '@/features/shared';
import { adoptSharedWebComponentStyles } from '@/features/shared/lib/utils/web-component-style.util';

import resetTailwind from '@unocss/reset/tailwind.css?raw';

const sharedStyles = [
  {
    id: 'tailwind-reset',
    cssText: resetTailwind.replaceAll(':root', `:host`),
  },
  {
    id: 'core-style',
    cssText: styles.replaceAll(':root', `:host`),
  },
];

const PrimaryButtonElementBase = defineCustomElement(PrimaryButton);

class PrimaryButtonElement extends PrimaryButtonElementBase {
  public override connectedCallback(): void {
    super.connectedCallback();
    adoptSharedWebComponentStyles(this.shadowRoot, sharedStyles);
  }
}

customElements.define(`${config.get('webComponentPrefix')}primary-button`, PrimaryButtonElement);
