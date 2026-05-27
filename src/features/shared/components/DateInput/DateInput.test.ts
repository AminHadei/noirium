import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vite-plus/test';
import { nextTick } from 'vue';

import DateInput from './DateInput.vue';

describe('DateInput', () => {
  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders label and required asterisk', () => {
    wrapper = mount(DateInput, {
      props: { modelValue: null, label: 'Birthday', required: true },
    });

    expect(wrapper.find('label').text()).toContain('Birthday');
    expect(wrapper.find('label span').text()).toBe('*');
  });

  it('renders placeholder when no value is selected', () => {
    wrapper = mount(DateInput, {
      props: { modelValue: null, placeholder: 'Pick a date' },
    });

    expect(wrapper.find('button').text()).toContain('Pick a date');
  });

  it('emits update:modelValue when DatePicker emits a new date', async () => {
    const onUpdate = vi.fn<(d: Date) => void>();
    wrapper = mount(DateInput, {
      props: { modelValue: null, 'onUpdate:modelValue': onUpdate },
    });

    const datePicker = wrapper.findComponent({ name: 'DatePicker' });
    const newDate = new Date('2024-01-15T00:00:00Z');
    const vnodeProps = (
      datePicker.vm as unknown as { $: { vnode: { props: Record<string, unknown> } } }
    ).$.vnode.props;
    const handler = vnodeProps['onUpdate:modelValue'] as (d: Date) => void;
    handler(newDate);
    await nextTick();

    expect(onUpdate).toHaveBeenCalledWith(newDate);
  });
});
