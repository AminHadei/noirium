import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { BaseBadge } from '@/features/shared';

describe('BaseBadge', () => {
  describe('Component Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Test Badge',
        },
      });

      expect(wrapper.text()).toContain('Test Badge');
      expect(wrapper.classes()).toContain('font-noto');
      expect(wrapper.classes()).toContain('font-semibold');
      expect(wrapper.classes()).toContain('text-xs');
      expect(wrapper.classes()).toContain('rounded-full');
    });

    it('renders slot content correctly', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      });

      expect(wrapper.html()).toContain('Custom Content');
    });

    it('handles empty slot content', () => {
      const wrapper = mount(BaseBadge);

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Color Variants', () => {
    it('applies red variant classes by default', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.classes()).toContain('bg-status-badge-red-bg');
      expect(wrapper.classes()).toContain('text-status-badge-red-text');
      expect(wrapper.classes()).not.toContain('bg-status-badge-green-bg');
    });

    it('applies red variant classes when color prop is red', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'red',
        },
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.classes()).toContain('bg-status-badge-red-bg');
      expect(wrapper.classes()).toContain('text-status-badge-red-text');
      expect(wrapper.classes()).not.toContain('bg-status-badge-green-bg');
    });

    it('applies green variant classes when color prop is green', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'green',
        },
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.classes()).toContain('bg-status-badge-green-bg');
      expect(wrapper.classes()).toContain('text-status-badge-green-text');
      expect(wrapper.classes()).not.toContain('bg-status-badge-red-bg');
    });

    it('applies white variant classes', () => {
      const wrapper = mount(BaseBadge, {
        props: { color: 'white' },
        slots: { default: 'Badge' },
      });

      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('text-text-darker');
      expect(wrapper.classes()).toContain('border');
    });

    it('applies gray variant classes', () => {
      const wrapper = mount(BaseBadge, {
        props: { color: 'gray' },
        slots: { default: 'Badge' },
      });

      expect(wrapper.classes()).toContain('bg-surface');
      expect(wrapper.classes()).toContain('text-text-dark');
    });

    it('applies black variant classes', () => {
      const wrapper = mount(BaseBadge, {
        props: { color: 'black' },
        slots: { default: 'Badge' },
      });

      expect(wrapper.classes()).toContain('bg-primary');
      expect(wrapper.classes()).toContain('text-white');
    });

    it('applies inline styles for custom colors', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'custom',
          customBackground: '#EDE9FE',
          customText: '#5B21B6',
        },
        slots: { default: 'Badge' },
      });

      const element = wrapper.element as HTMLElement;
      expect(element.style.backgroundColor).toBe('rgb(237, 233, 254)');
      expect(element.style.color).toBe('rgb(91, 33, 182)');
      expect(wrapper.classes()).not.toContain('bg-status-badge-red-bg');
    });

    it('falls back to gray when custom is set without color values', () => {
      const wrapper = mount(BaseBadge, {
        props: { color: 'custom' },
        slots: { default: 'Badge' },
      });

      expect(wrapper.classes()).toContain('bg-surface');
      expect(wrapper.classes()).toContain('text-text-dark');
      expect(wrapper.attributes('style')).toBeUndefined();
    });

    it('uses gray label tokens when only customBackground is set', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'custom',
          customBackground: '#EDE9FE',
        },
        slots: { default: 'Badge' },
      });

      const element = wrapper.element as HTMLElement;
      expect(element.style.backgroundColor).toBe('rgb(237, 233, 254)');
      expect(element.style.color).toBe('');
      expect(wrapper.classes()).toContain('text-text-dark');
      expect(wrapper.classes()).not.toContain('bg-surface');
    });

    it('uses gray background tokens when only customText is set', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'custom',
          customText: '#5B21B6',
        },
        slots: { default: 'Badge' },
      });

      const element = wrapper.element as HTMLElement;
      expect(element.style.backgroundColor).toBe('');
      expect(element.style.color).toBe('rgb(91, 33, 182)');
      expect(wrapper.classes()).toContain('bg-surface');
      expect(wrapper.classes()).not.toContain('text-text-dark');
    });
  });

  describe('CSS Classes', () => {
    it('includes base classes', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Badge',
        },
      });

      const baseClasses = ['font-noto', 'font-semibold', 'text-xs', 'rounded-full', 'px-3', 'py-1'];

      for (const className of baseClasses) {
        expect(wrapper.classes()).toContain(className);
      }
    });

    it('renders as a div element', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.element.tagName).toBe('DIV');
    });
  });

  describe('Props', () => {
    it('accepts color prop', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'green',
        },
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.props('color')).toBe('green');
    });

    it('uses default color when not provided', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Badge',
        },
      });

      expect(wrapper.props('color')).toBe('red');
    });
  });

  describe('Computed Classes', () => {
    it('computes correct classes for red variant', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'red',
        },
        slots: {
          default: 'Badge',
        },
      });

      const classes = wrapper.classes();
      expect(classes).toContain('bg-status-badge-red-bg');
      expect(classes).toContain('text-status-badge-red-text');
      expect(classes).not.toContain('bg-status-badge-green-bg');
    });

    it('computes correct classes for green variant', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          color: 'green',
        },
        slots: {
          default: 'Badge',
        },
      });

      const classes = wrapper.classes();
      expect(classes).toContain('bg-status-badge-green-bg');
      expect(classes).toContain('text-status-badge-green-text');
      expect(classes).not.toContain('bg-status-badge-red-bg');
    });
  });

  describe('Content', () => {
    it('renders text content', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Overdue',
        },
      });

      expect(wrapper.text()).toBe('Overdue');
    });

    it('renders HTML content in slot', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: '<strong>Important</strong>',
        },
      });

      expect(wrapper.html()).toContain('<strong>Important</strong>');
    });

    it('renders multiple elements in slot', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: '<span>Status:</span> <span>Active</span>',
        },
      });

      expect(wrapper.html()).toContain('<span>Status:</span>');
      expect(wrapper.html()).toContain('<span>Active</span>');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long text content', () => {
      const longText = 'This is a very long badge text that might overflow';
      const wrapper = mount(BaseBadge, {
        slots: {
          default: longText,
        },
      });

      expect(wrapper.text()).toBe(longText);
      expect(wrapper.exists()).toBe(true);
    });

    it('handles special characters in content', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const wrapper = mount(BaseBadge, {
        slots: {
          default: specialText,
        },
      });

      expect(wrapper.text()).toBe(specialText);
    });

    it('handles numeric content', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: '123',
        },
      });

      expect(wrapper.text()).toBe('123');
    });
  });
});
