import { mount, flushPromises } from '@vue/test-utils';
import dayjs from 'dayjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vite-plus/test';

import { Countdown } from '@/features/shared';

describe('Countdown.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders countdown text', () => {
      const futureDate = new Date(Date.now() + 90 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('Starts in');
    });

    it('renders with icon by default', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      const icon = wrapper.find('.i-calendar-bold');
      expect(icon.exists()).toBe(true);
    });

    it('renders without icon when showIcon is false', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          showIcon: false,
        },
      });

      const icon = wrapper.find('.i-calendar-bold');
      expect(icon.exists()).toBe(false);
    });

    it('applies custom icon class', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          iconClass: 'custom-icon',
        },
      });

      const icon = wrapper.find('.custom-icon');
      expect(icon.exists()).toBe(true);
    });

    it('applies custom text class', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          textClass: 'custom-text',
        },
      });

      const text = wrapper.find('.custom-text');
      expect(text.exists()).toBe(true);
    });
  });

  describe('Time Formatting', () => {
    it('displays only seconds when less than 1 minute', () => {
      const futureDate = dayjs().add(45, 's').toDate();
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('45s');
      expect(wrapper.text()).not.toContain('m');
      expect(wrapper.text()).not.toContain('h');
      expect(wrapper.text()).not.toContain('d');
    });

    it('displays minutes and seconds when less than 1 hour', () => {
      // 30 minutes
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('30m');
      expect(wrapper.text()).toContain('s');
    });

    it('displays hours, minutes, and seconds when less than 24 hours', () => {
      const futureDate = dayjs().add(5, 'hours').toDate();
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('5h');
      expect(wrapper.text()).toContain('0m');
    });

    it('displays days, hours, minutes, and seconds when 24 hours or more', () => {
      const futureDate = dayjs().add(3, 'days').toDate();
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('3d');
    });

    it('displays long format with all units', () => {
      const futureDate = dayjs().add(30, 'minute').toDate();
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          format: 'long',
        },
      });

      expect(wrapper.text()).toContain('minutes');
      expect(wrapper.text()).toContain('seconds');
    });

    it('displays long format for singular units', () => {
      // 1 minute 1 second
      const futureDate = new Date(Date.now() + 61 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          format: 'long',
        },
      });

      expect(wrapper.text()).toContain('1 minute');
      expect(wrapper.text()).toContain('1 second');
    });

    it('displays long format with multiple units', () => {
      // 5 hours 30 minutes
      const futureDate = new Date(Date.now() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          format: 'long',
        },
      });

      expect(wrapper.text()).toContain('hours');
      expect(wrapper.text()).toContain('minutes');
    });

    it('displays all units in long format when days present', () => {
      // 3 days 2 hours
      const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
          format: 'long',
        },
      });

      expect(wrapper.text()).toContain('days');
      expect(wrapper.text()).toContain('hours');
    });
  });

  describe('MySQL Date Format Support', () => {
    it('handles MySQL datetime string format', () => {
      const futureDate = dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss');
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('Starts in');
    });

    it('handles Date object', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('Starts in');
    });

    it('returns empty string for invalid date', () => {
      const wrapper = mount(Countdown, {
        props: {
          startDate: 'invalid-date',
        },
      });

      expect(wrapper.text().trim()).toBe('-');
    });
  });

  describe('Timer Updates', () => {
    it('updates countdown every second by default', async () => {
      // 61 seconds
      const futureDate = new Date(Date.now() + 61 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      expect(wrapper.text()).toContain('1m');
      expect(wrapper.text()).toContain('1s');

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('1m');
      expect(wrapper.text()).toContain('0s');
    });
  });

  describe('Slots', () => {
    it('supports custom slot content', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
        slots: {
          default: '<span class="custom-countdown">Custom Text</span>',
        },
      });

      expect(wrapper.find('.custom-countdown').text()).toBe('Custom Text');
    });

    it('provides countdown and expired to scoped slot', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
        slots: {
          default: `
            <template #default="{ countdown, expired }">
              <span class="countdown-text">{{ countdown }}</span>
              <span class="expired-status">{{ expired }}</span>
            </template>
          `,
        },
      });

      expect(wrapper.find('.countdown-text').exists()).toBe(true);
      expect(wrapper.find('.expired-status').text()).toBe('false');
    });
  });

  describe('Events', () => {
    it('emits expired event when countdown reaches zero', async () => {
      const expiredSpy = vi.fn<() => void>();
      // 1.5 seconds
      const futureDate = new Date(Date.now() + 1500);
      mount(Countdown, {
        props: {
          startDate: futureDate,
          onExpired: expiredSpy,
        },
      });

      // Advance past the end time
      vi.advanceTimersByTime(2000);
      await flushPromises();

      expect(expiredSpy).toHaveBeenCalled();
      expect(expiredSpy).toHaveBeenCalledTimes(1);
    });

    it('stops timer after emitting expired event', async () => {
      // 1 second
      const futureDate = new Date(Date.now() + 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      // Advance past the end time
      vi.advanceTimersByTime(2000);
      await wrapper.vm.$nextTick();

      const expiredEmitCount = wrapper.emitted('expired')?.length;

      // Advance more time to ensure timer has stopped
      vi.advanceTimersByTime(5000);
      await wrapper.vm.$nextTick();

      // Should not emit expired again
      expect(wrapper.emitted('expired')?.length).toBe(expiredEmitCount);
    });
  });

  describe('Cleanup', () => {
    it('clears interval on unmount', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const wrapper = mount(Countdown, {
        props: {
          startDate: futureDate,
        },
      });

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      wrapper.unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
