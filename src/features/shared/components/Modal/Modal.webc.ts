import styles from 'virtual:core-styles';
import { defineCustomElement } from 'vue';

import { config } from '@/config';
import Modal from '@/features/shared/components/Modal/Modal.vue';
import { adoptSharedWebComponentStyles } from '@/features/shared/lib/utils/web-component-style.util';

import resetTailwind from '@unocss/reset/tailwind.css?raw';

const sharedStyles = [
  { id: 'tailwind-reset', cssText: resetTailwind.replaceAll(':root', `:host`) },
  { id: 'core-style', cssText: styles.replaceAll(':root', `:host`) },
];

const ModalElementBase = defineCustomElement(Modal);

class ModalElement extends ModalElementBase {
  public override connectedCallback(): void {
    super.connectedCallback();
    adoptSharedWebComponentStyles(this.shadowRoot, sharedStyles);
  }
}

customElements.define(`${config.get('webComponentPrefix')}modal`, ModalElement);
