import type { InjectionKey, Ref } from 'vue';

export interface CommandContext {
  search: Ref<string>;
  visibleCount: Ref<number>;
  setSearch: (value: string) => void;
  matches: (text: string) => boolean;
  registerItem: (id: symbol, text: string) => void;
  unregisterItem: (id: symbol) => void;
}

export const commandContextKey: InjectionKey<CommandContext> = Symbol('NoiriumCommand');
