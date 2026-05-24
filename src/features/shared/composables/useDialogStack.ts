import { type ComputedRef, computed, ref } from 'vue';

const stack = ref<symbol[]>([]);

export interface UseDialogStackReturn {
  register: () => void;
  unregister: () => void;
  isTopmost: ComputedRef<boolean>;
  index: ComputedRef<number>;
}

/**
 * Module-level stack of open dialogs. Used to coordinate nested dialogs:
 *   - only the topmost dialog reacts to ESC
 *   - z-index is derived from stack position so each dialog's backdrop
 *     layers correctly above dialogs opened before it
 */
export function useDialogStack(id: symbol): UseDialogStackReturn {
  const register = (): void => {
    if (!stack.value.includes(id)) stack.value.push(id);
  };

  const unregister = (): void => {
    const idx = stack.value.indexOf(id);
    if (idx !== -1) stack.value.splice(idx, 1);
  };

  const isTopmost = computed(() => stack.value.at(-1) === id);
  const index = computed(() => stack.value.indexOf(id));

  return { register, unregister, isTopmost, index };
}
