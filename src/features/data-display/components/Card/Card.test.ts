import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { h } from 'vue';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/data-display';

describe('Card', () => {
  it('renders its composed parts', () => {
    const wrapper = mount(Card, {
      slots: {
        default: () => [
          h(CardHeader, () => [
            h(CardTitle, () => 'Title'),
            h(CardDescription, () => 'Description'),
          ]),
          h(CardContent, () => 'Content'),
        ],
      },
    });

    expect(wrapper.attributes('data-slot')).toBe('card');
    expect(wrapper.find('[data-slot="card-title"]').text()).toBe('Title');
    expect(wrapper.find('[data-slot="card-description"]').text()).toBe('Description');
    expect(wrapper.find('[data-slot="card-content"]').text()).toBe('Content');
  });
});
