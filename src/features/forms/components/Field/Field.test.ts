import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { h } from 'vue';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/features/forms';

describe('Field', () => {
  it('renders a field stack with its parts', () => {
    const wrapper = mount(Field, {
      slots: {
        default: () => [
          h(FieldLabel, { for: 'name' }, () => 'Name'),
          h(FieldDescription, () => 'Helper text'),
          h(FieldError, () => 'Required'),
        ],
      },
    });

    expect(wrapper.attributes('data-slot')).toBe('field');
    expect(wrapper.find('[data-slot="field-label"]').text()).toBe('Name');
    expect(wrapper.find('[data-slot="field-description"]').text()).toBe('Helper text');
    expect(wrapper.find('[data-slot="field-error"]').text()).toBe('Required');
  });
});
