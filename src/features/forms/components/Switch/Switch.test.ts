import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { ref } from 'vue';

import { Switch } from '@/features/forms';

describe('Switch', () => {
  it('toggles v-model on click', async () => {
    const on = ref(false);
    const wrapper = mount({
      components: { Switch },
      setup: () => ({ on }),
      template: '<Switch v-model="on" />',
    });

    await wrapper.find('button').trigger('click');
    expect(on.value).toBe(true);
  });
});
