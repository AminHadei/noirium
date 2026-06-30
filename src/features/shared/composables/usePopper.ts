import { createPopper, type Instance, type Placement } from '@popperjs/core';
import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

export interface UsePopperOptions {
  placement?: Placement;
  offset?: number;
}

/**
 * Positions a floating element against a reference element with Popper while
 * the `open` ref is truthy. The floating element is expected to be rendered
 * conditionally (e.g. behind a `v-if`), so the instance is (re)created on open
 * and destroyed on close.
 */
export function usePopper(
  reference: Ref<HTMLElement | null>,
  floating: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  options: UsePopperOptions = {},
): void {
  const { placement = 'bottom', offset = 8 } = options;
  let instance: Instance | null = null;

  const destroy = (): void => {
    instance?.destroy();
    instance = null;
  };

  watch(open, async (value): Promise<void> => {
    if (!value) {
      destroy();
      return;
    }

    await nextTick();
    if (reference.value === null || floating.value === null) return;

    instance = createPopper(reference.value, floating.value, {
      placement,
      strategy: 'fixed',
      modifiers: [{ name: 'offset', options: { offset: [0, offset] } }],
    });
  });

  onBeforeUnmount(destroy);
}
