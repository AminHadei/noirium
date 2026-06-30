import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Label } from '@/features/forms';

describe('Label', () => {
  it('renders label text and associates with control id', () => {
    const wrapper = mount(Label, {
      props: { for: 'email' },
      slots: { default: 'Email' },
    });
    expect(wrapper.text()).toBe('Email');
    expect(wrapper.attributes('for')).toBe('email');
  });
});
