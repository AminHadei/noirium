import type { InjectionKey, Ref } from 'vue';

export interface AccordionContext {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

export const accordionContextKey: InjectionKey<AccordionContext> = Symbol('NoiriumAccordion');

export interface AccordionItemContext {
  value: Ref<string>;
}

export const accordionItemKey: InjectionKey<AccordionItemContext> = Symbol('NoiriumAccordionItem');
