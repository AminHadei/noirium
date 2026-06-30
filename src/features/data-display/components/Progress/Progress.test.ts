import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Progress } from '@/features/data-display';

describe('Progress', () => {
  it('renders progressbar with value', () => {
    const wrapper = mount(Progress, { props: { value: 40, max: 100 } });
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-valuenow')).toBe('40');
  });
});
