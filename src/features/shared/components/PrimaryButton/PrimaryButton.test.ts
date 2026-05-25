import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import { PrimaryButton } from '@/features/shared';

describe('PrimaryButton', () => {
  describe('Component Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Click me',
        },
      });

      expect(wrapper.text()).toContain('Click me');
      expect(wrapper.classes()).toContain('group');
    });

    it('renders slot content correctly', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      });

      expect(wrapper.html()).toContain('Custom Content');
    });
  });

  describe('Variants', () => {
    it('applies primary variant classes by default', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('bg-primary');
      expect(wrapper.classes()).toContain('text-white');
    });

    it('applies outline variant classes', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          variant: 'outline',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('border');
      expect(wrapper.classes()).toContain('border-primary');
      expect(wrapper.classes()).toContain('text-primary');
    });

    it('applies text variant classes', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          variant: 'text',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('bg-transparent');
      expect(wrapper.classes()).toContain('text-primary');
    });
  });

  describe('Component Type', () => {
    it('renders as button by default', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('renders as anchor tag when href is provided', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          href: 'https://example.com',
        },
        slots: {
          default: 'Link',
        },
      });

      expect(wrapper.element.tagName).toBe('A');
      expect(wrapper.attributes('href')).toBe('https://example.com');
      expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
    });

    it('renders as nuxt-link when to prop is provided', () => {
      const NuxtLinkStub = {
        name: 'nuxt-link',
        template: '<a><slot /></a>',
        props: ['to'],
      };

      const wrapper = mount(PrimaryButton, {
        props: {
          to: '/page',
        },
        slots: {
          default: 'Router Link',
        },
        global: {
          stubs: {
            'nuxt-link': NuxtLinkStub,
          },
          components: {
            'nuxt-link': NuxtLinkStub,
          },
        },
      });

      // Check that the component is using nuxt-link by checking the element or finding the stub
      const nuxtLink = wrapper.findComponent(NuxtLinkStub);
      expect(nuxtLink.exists()).toBe(true);
      expect(nuxtLink.props('to')).toBe('/page');
    });
  });

  describe('States', () => {
    it('applies disabled styles when disabled prop is true', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
          variant: 'primary',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('pointer-events-none');
      expect(wrapper.classes()).toContain('bg-primary/30');
      expect(wrapper.classes()).toContain('text-white/60');
      expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('applies disabled styles for outline variant', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
          variant: 'outline',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('border-primary/30');
      expect(wrapper.classes()).toContain('text-primary/30');
    });

    it('applies disabled styles for text variant', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
          variant: 'text',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('text-primary/30');
    });

    it('applies loading styles when loading prop is true', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('pointer-events-none');
      expect(wrapper.find('.loader').exists()).toBe(true);
    });

    it('shows loader instead of chevron when loading', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.find('.loader').exists()).toBe(true);
      expect(wrapper.find('svg').exists()).toBe(false);
    });
  });

  describe('Chevron Icon', () => {
    it('displays chevron icon by default', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      const svg = wrapper.find('.i-chevron');
      expect(svg.exists()).toBe(true);
    });

    it('hides chevron when showChevron is false', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          showChevron: false,
        },
        slots: {
          default: 'Button',
        },
      });

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(false);
    });

    it('hides chevron when loading is true', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          loading: true,
          showChevron: true,
        },
        slots: {
          default: 'Button',
        },
      });

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(false);
      expect(wrapper.find('.loader').exists()).toBe(true);
    });
  });

  describe('Click Events', () => {
    it('emits click event when clicked', async () => {
      const onButtonClick = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          PrimaryButton,
        },
        template: '<PrimaryButton @click="onButtonClick">Button</PrimaryButton>',
        methods: {
          onButtonClick,
        },
      };

      const wrapper = mount(TestWrapper);
      const button = wrapper.findComponent(PrimaryButton);

      await button.trigger('click');

      // Verify the click handler was called (which means the event was emitted)
      expect(onButtonClick).toHaveBeenCalledTimes(1);
      expect(onButtonClick).toHaveBeenCalledWith(expect.any(Event));
    });

    it('does not emit click event when disabled', async () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: 'Button',
        },
      });

      await wrapper.trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('does not emit click event when loading', async () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Button',
        },
      });

      await wrapper.trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('prevents default for button elements', async () => {
      const onSubmit = vi.fn<() => void>();
      const wrapper = mount(
        {
          template: `
            <form @submit.prevent="onSubmit">
              <PrimaryButton>Submit</PrimaryButton>
            </form>
          `,
          components: {
            PrimaryButton,
          },
          methods: {
            onSubmit,
          },
        },
        {
          global: {
            components: {
              PrimaryButton,
            },
          },
        },
      );

      const button = wrapper.find('button');
      await button.trigger('click');

      // If preventDefault works, the form should not submit
      // Since the button is inside a form, clicking it would normally submit
      // But our component prevents default, so onSubmit should not be called
      expect(onSubmit).not.toHaveBeenCalled();
      expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('does not prevent default for anchor elements', async () => {
      const onLinkClick = vi.fn<() => void>();
      const TestWrapper = {
        components: {
          PrimaryButton,
        },
        template:
          '<PrimaryButton href="https://example.com" @click="onLinkClick">Link</PrimaryButton>',
        methods: {
          onLinkClick,
        },
      };

      const wrapper = mount(TestWrapper);
      const button = wrapper.findComponent(PrimaryButton);

      await button.trigger('click');

      // For links, we don't prevent default unless disabled/loading
      // The component only prevents default for button type
      // Verify the click handler was called (which means the event was emitted)
      expect(onLinkClick).toHaveBeenCalledTimes(1);
      expect(onLinkClick).toHaveBeenCalledWith(expect.any(Event));
    });
  });

  describe('CSS Classes', () => {
    it('includes base classes', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      const baseClasses = [
        'select-none',
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'font-medium',
        'transition-colors',
      ];

      for (const className of baseClasses) {
        expect(wrapper.classes()).toContain(className);
      }
    });

    it('includes focus-visible classes', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('focus-visible:outline-none');
      expect(wrapper.classes()).toContain('focus-visible:outline-dashed');
    });
  });

  describe('Attributes', () => {
    it('passes through custom attributes', () => {
      const wrapper = mount(PrimaryButton, {
        attrs: {
          'data-testid': 'custom-button',
          'aria-label': 'Custom Label',
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-button');
      expect(wrapper.attributes('aria-label')).toBe('Custom Label');
    });

    it('sets rel attribute for external links', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          href: 'https://example.com',
        },
        slots: {
          default: 'Link',
        },
      });

      expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
    });

    it('does not set rel attribute for buttons', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.attributes('rel')).toBeUndefined();
    });
  });

  describe('Accessibility', () => {
    it('can be disabled via disabled prop', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('includes proper cursor styling', () => {
      const wrapper = mount(PrimaryButton, {
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('cursor-pointer');
    });

    it('removes pointer events when disabled', () => {
      const wrapper = mount(PrimaryButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: 'Button',
        },
      });

      expect(wrapper.classes()).toContain('pointer-events-none');
    });
  });

  describe('Edge Cases', () => {
    it('handles both to and href being provided (to takes precedence)', () => {
      const NuxtLinkStub = {
        name: 'nuxt-link',
        template: '<a><slot /></a>',
        props: ['to'],
      };

      const wrapper = mount(PrimaryButton, {
        props: {
          to: '/page',
          href: 'https://example.com',
        },
        slots: {
          default: 'Button',
        },
        global: {
          stubs: {
            'nuxt-link': NuxtLinkStub,
          },
          components: {
            'nuxt-link': NuxtLinkStub,
          },
        },
      });

      // to takes precedence over href
      const nuxtLink = wrapper.findComponent(NuxtLinkStub);
      expect(nuxtLink.exists()).toBe(true);
      expect(nuxtLink.props('to')).toBe('/page');
    });

    it('handles object-based to prop for routing', () => {
      const toObject = {
        name: 'home',
        params: {
          id: 1,
        },
      };
      const NuxtLinkStub = {
        name: 'nuxt-link',
        template: '<a><slot /></a>',
        props: ['to'],
      };

      const wrapper = mount(PrimaryButton, {
        props: {
          to: toObject,
        },
        slots: {
          default: 'Button',
        },
        global: {
          stubs: {
            'nuxt-link': NuxtLinkStub,
          },
          components: {
            'nuxt-link': NuxtLinkStub,
          },
        },
      });

      const nuxtLink = wrapper.findComponent(NuxtLinkStub);
      expect(nuxtLink.exists()).toBe(true);
      expect(nuxtLink.props('to')).toEqual(toObject);
    });

    it('handles empty slot content', () => {
      const wrapper = mount(PrimaryButton);

      expect(wrapper.exists()).toBe(true);
    });
  });
});
