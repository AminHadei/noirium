import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Input } from '@/features/forms';

describe('Input', () => {
  it('binds v-model', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello', 'onUpdate:modelValue': () => {} },
    });
    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('hello');
  });
});
