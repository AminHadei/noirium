import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Textarea } from '@/features/forms';

describe('Textarea', () => {
  it('renders textarea element', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'note', 'onUpdate:modelValue': () => {} },
    });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });
});
