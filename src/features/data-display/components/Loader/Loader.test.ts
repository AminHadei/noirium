import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Loader } from '@/features/data-display';

describe('Loader', () => {
  it('renders status landmark with bouncing dots', () => {
    const wrapper = mount(Loader, { props: { count: 3 } });
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.findAll('div').length).toBeGreaterThan(1);
  });
});
