import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Empty, EmptyDescription, EmptyTitle } from '@/features/data-display';

describe('Empty', () => {
  it('renders empty state slots', () => {
    const wrapper = mount(Empty, {
      slots: {
        default:
          '<EmptyTitle>No items</EmptyTitle><EmptyDescription>Add one to get started.</EmptyDescription>',
      },
      global: { components: { EmptyTitle, EmptyDescription } },
    });
    expect(wrapper.find('[data-slot="empty"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('No items');
  });
});
