import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Alert, AlertDescription, AlertTitle } from '@/features/feedback';

describe('Alert', () => {
  it('renders alert landmark with title and description', () => {
    const wrapper = mount(Alert, {
      props: { status: 'error' },
      slots: {
        default: `
          <AlertTitle>Unable to save</AlertTitle>
          <AlertDescription>Try again in a moment.</AlertDescription>
        `,
      },
      global: {
        components: { AlertTitle, AlertDescription },
      },
    });

    expect(wrapper.attributes('role')).toBe('alert');
    expect(wrapper.text()).toContain('Unable to save');
    expect(wrapper.text()).toContain('Try again in a moment.');
  });
});
