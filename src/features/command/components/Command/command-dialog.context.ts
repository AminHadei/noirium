import type { InjectionKey } from 'vue';

export interface CommandDialogContext {
  close: () => void;
}

export const commandDialogContextKey: InjectionKey<CommandDialogContext> =
  Symbol('NoiriumCommandDialog');
