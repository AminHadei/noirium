import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Slider } from '@/features/forms';

describe('Slider', () => {
  it('renders range input', () => {
    const wrapper = mount(Slider, { props: { modelValue: 25, 'onUpdate:modelValue': () => {} } });
    expect(wrapper.find('input[type="range"]').exists()).toBe(true);
  });
});
