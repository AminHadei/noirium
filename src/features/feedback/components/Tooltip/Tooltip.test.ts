import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';
import { h, nextTick } from 'vue';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/features/feedback';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows content after the delay on hover and hides on leave', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: { delay: 100 },
      slots: {
        default: () => [h(TooltipTrigger, () => 'Trigger'), h(TooltipContent, () => 'Tip')],
      },
    });

    await wrapper.find('[data-slot="tooltip-trigger"]').trigger('mouseenter');
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    vi.advanceTimersByTime(100);
    await nextTick();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Tip');

    vi.useRealTimers();
    await wrapper.find('[data-slot="tooltip-trigger"]').trigger('mouseleave');
    await vi.waitFor(() => {
      expect(document.querySelector('[role="tooltip"]')).toBeNull();
    });

    wrapper.unmount();
  });
});
