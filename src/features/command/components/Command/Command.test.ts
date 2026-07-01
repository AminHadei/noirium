import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';
import { defineComponent, nextTick } from 'vue';

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/features/command';

const Harness = defineComponent({
  components: { Command, CommandInput, CommandList, CommandEmpty, CommandItem },
  template: `
    <Command>
      <CommandInput />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem value="apple" @select="onSelect">Apple</CommandItem>
        <CommandItem value="banana" @select="onSelect">Banana</CommandItem>
      </CommandList>
    </Command>
  `,
  props: {
    onSelect: { type: Function, default: undefined },
  },
});

const isHidden = (el: Element | null): boolean =>
  el !== null && (el.getAttribute('style') ?? '').includes('display: none');

describe('Command', () => {
  it('filters items by the search query', async () => {
    const wrapper = mount(Harness);
    await nextTick();

    const items = (): NodeListOf<HTMLElement> =>
      wrapper.element.querySelectorAll('[data-slot="command-item"]');

    expect(isHidden(items()[0]!)).toBe(false);
    expect(isHidden(items()[1]!)).toBe(false);

    await wrapper.find('[data-slot="command-input-field"]').setValue('ban');
    await nextTick();

    expect(isHidden(items()[0]!)).toBe(true);
    expect(isHidden(items()[1]!)).toBe(false);
  });

  it('shows the empty state when nothing matches', async () => {
    const wrapper = mount(Harness);
    await nextTick();

    expect(wrapper.find('[data-slot="command-empty"]').exists()).toBe(false);

    await wrapper.find('[data-slot="command-input-field"]').setValue('zzz');
    await nextTick();

    expect(wrapper.find('[data-slot="command-empty"]').exists()).toBe(true);
  });

  it('emits select when an item is clicked', async () => {
    const onSelect = vi.fn<() => void>();
    const wrapper = mount(Harness, { props: { onSelect } });
    await nextTick();

    await wrapper.findAll('[data-slot="command-item"]')[0]!.trigger('click');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
