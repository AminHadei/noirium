import { type Ref, ref, watch } from 'vue';

export interface UseLazyVisibleReturn {
  visible: Ref<boolean>;
  mounted: Ref<boolean>;
}

/**
 * Separates "is rendered" from "is visible" so leave transitions play correctly
 * on async/lazy components.
 *
 * Pattern:
 *   v-if="mounted"   — lazy: becomes true on first open, never goes false again
 *   v-model:visible="visible" — drives the component's own enter/leave transition
 */
export function useLazyVisible(initialVisible = false): UseLazyVisibleReturn {
  const visible = ref(initialVisible);
  const mounted = ref(initialVisible);

  watch(visible, (val) => {
    if (val) mounted.value = true;
  });

  return { visible, mounted };
}
