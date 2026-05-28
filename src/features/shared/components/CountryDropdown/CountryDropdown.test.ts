import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vite-plus/test';
import { nextTick } from 'vue';

import CountryDropdown from './CountryDropdown.vue';

const callBaseDropdownHandler = (mounted: ReturnType<typeof mount>, arg: unknown): void => {
  const inner = mounted.findComponent({ name: 'BaseDropdown' });
  const vnodeProps =
    (inner.vm as unknown as { $: { vnode: { props: Record<string, unknown> } } }).$.vnode.props ??
    {};
  const handler = (vnodeProps['onUpdate:modelValue'] ?? vnodeProps['onUpdate:model-value']) as
    | ((v: unknown) => void)
    | undefined;
  handler?.(arg);
};

describe('CountryDropdown', () => {
  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Rendering', () => {
    it('should not render when visible is false', () => {
      wrapper = mount(CountryDropdown, {
        props: {
          visible: false,
        },
      });

      expect(wrapper.find('ul').exists()).toBe(false);
    });
  });

  describe('Selection', () => {
    it('emits update:modelValue and select when an item is chosen', async () => {
      const onUpdate = vi.fn<(arg?: unknown) => void>();
      const onSelect = vi.fn<(arg?: unknown) => void>();
      wrapper = mount(CountryDropdown, {
        props: {
          modelValue: null,
          'onUpdate:modelValue': onUpdate,
          onSelect,
        },
      });

      callBaseDropdownHandler(wrapper, { iso2: 'us' });
      await nextTick();

      expect(onUpdate).toHaveBeenCalledWith('us');
      expect(onSelect).toHaveBeenCalledWith('us');
    });

    it('emits null update:modelValue when null is selected', async () => {
      const onUpdate = vi.fn<(arg?: unknown) => void>();
      const onSelect = vi.fn<(arg?: unknown) => void>();
      wrapper = mount(CountryDropdown, {
        props: {
          modelValue: 'us',
          'onUpdate:modelValue': onUpdate,
          onSelect,
        },
      });

      callBaseDropdownHandler(wrapper, null);
      await nextTick();

      expect(onUpdate).toHaveBeenCalledWith(null);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
