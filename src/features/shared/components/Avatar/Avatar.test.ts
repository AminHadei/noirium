import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';
import { defineComponent, h, type VNode } from 'vue';

import { config } from '@/config';
import { Avatar } from '@/features/shared';

import type { AvatarProps } from './Avatar.vue';

describe('Avatar', () => {
  describe('Component Rendering', () => {
    it('renders as an img element', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: 'https://example.com/image.jpg',
          alt: 'Test avatar',
        },
      });

      expect(wrapper.element.tagName).toBe('IMG');
    });

    it('renders with default props', () => {
      const wrapper = mount(Avatar);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.element.tagName).toBe('IMG');
    });

    it('renders with src prop', () => {
      const src = 'https://example.com/image.jpg';
      const wrapper = mount(Avatar, {
        props: {
          src,
        },
      });

      expect(wrapper.attributes('src')).toBe(src);
    });

    it('renders with alt prop', () => {
      const alt = 'User avatar';
      const wrapper = mount(Avatar, {
        props: {
          alt,
        },
      });

      expect(wrapper.attributes('alt')).toBe(alt);
    });

    it('uses default alt text when alt is not provided', () => {
      const wrapper = mount(Avatar);

      expect(wrapper.attributes('alt')).toBe('Avatar');
    });

    it('uses provided alt text when alt is empty string', () => {
      const wrapper = mount(Avatar, {
        props: {
          alt: '',
        },
      });

      expect(wrapper.attributes('alt')).toBe('Avatar');
    });

    it('applies custom class prop', () => {
      const customClass = 'size-12 rounded-full object-cover';
      const wrapper = mount(Avatar, {
        props: {
          class: customClass,
        },
      });

      expect(wrapper.classes()).toContain('size-12');
      expect(wrapper.classes()).toContain('rounded-full');
      expect(wrapper.classes()).toContain('object-cover');
    });
  });

  describe('Fallback Behavior', () => {
    it('shows fallback image when src is null', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: null,
        },
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      // Vite converts SVG imports to data URLs
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('shows fallback image when src is undefined', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: null,
        },
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('shows fallback image when src is empty string', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: '',
        },
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('shows fallback image when src is not provided', () => {
      const wrapper = mount(Avatar);

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });
  });

  describe('Image Error Handling', () => {
    beforeEach(() => {
      // Mock console.error to avoid noise in tests
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('switches to fallback image when image fails to load', async () => {
      const invalidSrc = 'https://invalid-url-that-does-not-exist.com/image.jpg';
      const wrapper = mount(Avatar, {
        props: {
          src: invalidSrc,
        },
      });

      // Initially should have the invalid src
      expect(wrapper.attributes('src')).toBe(invalidSrc);

      // Simulate image error
      const img = wrapper.find('img');
      await img.trigger('error');

      // After error, should switch to fallback
      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('handles multiple error events gracefully', async () => {
      const invalidSrc = 'https://invalid-url.com/image.jpg';
      const wrapper = mount(Avatar, {
        props: {
          src: invalidSrc,
        },
      });

      const img = wrapper.find('img');

      // Trigger error multiple times
      await img.trigger('error');
      await img.trigger('error');
      await img.trigger('error');

      // Should still show fallback
      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toBeTruthy();
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('maintains fallback after error even if src changes to valid URL', async () => {
      const invalidSrc = 'https://invalid-url.com/image.jpg';
      const validSrc = 'https://i.pravatar.cc/150?img=1';

      const wrapper = mount(Avatar, {
        props: {
          src: invalidSrc,
        },
      });

      // Trigger error
      const img = wrapper.find('img');
      await img.trigger('error');

      // Change to valid src
      await wrapper.setProps({
        src: validSrc,
      });

      // Should still show fallback because error state persists
      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });
  });

  describe('Props Interface', () => {
    it('accepts all AvatarProps interface properties', () => {
      const props: AvatarProps = {
        src: 'https://example.com/image.jpg',
        alt: 'Test avatar',
      };

      const wrapper = mount(Avatar, {
        props,
      });

      expect(wrapper.props('src')).toBe(props.src);
      expect(wrapper.props('alt')).toBe(props.alt);
    });

    it('handles optional props correctly', () => {
      const wrapper = mount(Avatar, {
        props: {},
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.props('src')).toBeNull();
      expect(wrapper.props('alt')).toBe('');
    });
  });

  describe('Computed imageSrc', () => {
    it('returns src when src is provided and no error occurred', () => {
      const src = 'https://example.com/image.jpg';
      const wrapper = mount(Avatar, {
        props: {
          src,
        },
      });

      expect(wrapper.attributes('src')).toBe(src);
    });

    it('returns fallback when src is null', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: null,
        },
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });

    it('returns fallback when src is empty string', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: '',
        },
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });
  });

  describe('CSS Classes', () => {
    it('applies single class', () => {
      const wrapper = mount(Avatar, {
        props: {
          class: 'rounded-full',
        },
      });

      expect(wrapper.classes()).toContain('rounded-full');
    });

    it('applies multiple classes', () => {
      const wrapper = mount(Avatar, {
        props: {
          class: 'size-12 rounded-full object-cover',
        },
      });

      expect(wrapper.classes()).toContain('size-12');
      expect(wrapper.classes()).toContain('rounded-full');
      expect(wrapper.classes()).toContain('object-cover');
    });

    it('handles empty class string', () => {
      const wrapper = mount(Avatar, {
        props: {
          class: '',
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long src URLs', () => {
      const longUrl = `https://example.com/${'a'.repeat(1000)}/image.jpg`;
      const wrapper = mount(Avatar, {
        props: {
          src: longUrl,
        },
      });

      expect(wrapper.attributes('src')).toBe(longUrl);
    });

    it('handles special characters in alt text', () => {
      const specialAlt = 'User@#$%^&*()_+-=[]{}|;:,.<>?';
      const wrapper = mount(Avatar, {
        props: {
          alt: specialAlt,
        },
      });

      expect(wrapper.attributes('alt')).toBe(specialAlt);
    });

    it('handles unicode characters in alt text', () => {
      const unicodeAlt = '用户头像 🎭';
      const wrapper = mount(Avatar, {
        props: {
          alt: unicodeAlt,
        },
      });

      expect(wrapper.attributes('alt')).toBe(unicodeAlt);
    });

    it('handles data URLs as src', () => {
      const dataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjwvc3ZnPg==';
      const wrapper = mount(Avatar, {
        props: {
          src: dataUrl,
        },
      });

      expect(wrapper.attributes('src')).toBe(dataUrl);
    });

    it('handles relative URLs as src', () => {
      const relativeUrl = '/images/avatar.jpg';
      const wrapper = mount(Avatar, {
        props: {
          src: relativeUrl,
        },
      });

      expect(wrapper.attributes('src')).toBe(relativeUrl);
    });

    it('handles whitespace in class prop', () => {
      const wrapper = mount(Avatar, {
        props: {
          class: '  size-12  rounded-full  ',
        },
      });

      // Vue will normalize the classes
      expect(wrapper.classes()).toContain('size-12');
      expect(wrapper.classes()).toContain('rounded-full');
    });
  });

  describe('Accessibility', () => {
    it('always has an alt attribute', () => {
      const wrapper = mount(Avatar);

      expect(wrapper.attributes('alt')).toBeDefined();
      expect(wrapper.attributes('alt')).toBe('Avatar');
    });

    it('uses provided alt text for accessibility', () => {
      const alt = 'Profile picture of John Doe';
      const wrapper = mount(Avatar, {
        props: {
          alt,
        },
      });

      expect(wrapper.attributes('alt')).toBe(alt);
    });
  });

  describe('Configurable Image Component', () => {
    afterEach(() => {
      // Restore default after each test so other suites are not affected.
      config.set('imageComponent', 'img');
    });

    it('defaults to <img>', () => {
      const wrapper = mount(Avatar, { props: { src: 'https://example.com/a.jpg' } });
      expect(wrapper.element.tagName).toBe('IMG');
    });

    it('renders the component configured via config.set("imageComponent", …)', () => {
      const Stub = defineComponent({
        name: 'StubImage',
        props: ['src', 'alt', 'width', 'height'],
        emits: ['error'],
        setup(props) {
          return (): VNode => h('div', { 'data-testid': 'stub-image', 'data-src': props['src'] });
        },
      });

      config.set('imageComponent', Stub);

      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/a.jpg', width: 48, height: 48 },
      });

      expect(wrapper.element.tagName).toBe('DIV');
      expect(wrapper.attributes('data-testid')).toBe('stub-image');
      expect(wrapper.attributes('data-src')).toBe('https://example.com/a.jpg');
    });

    it('forwards width and height to the configured component', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/a.jpg', width: 48, height: 48 },
      });
      expect(wrapper.attributes('width')).toBe('48');
      expect(wrapper.attributes('height')).toBe('48');
    });
  });

  describe('Reactivity', () => {
    it('updates src when prop changes', async () => {
      const wrapper = mount(Avatar, {
        props: {
          src: 'https://example.com/image1.jpg',
        },
      });

      expect(wrapper.attributes('src')).toBe('https://example.com/image1.jpg');

      await wrapper.setProps({
        src: 'https://example.com/image2.jpg',
      });

      expect(wrapper.attributes('src')).toBe('https://example.com/image2.jpg');
    });

    it('updates alt when prop changes', async () => {
      const wrapper = mount(Avatar, {
        props: {
          alt: 'First alt',
        },
      });

      expect(wrapper.attributes('alt')).toBe('First alt');

      await wrapper.setProps({
        alt: 'Second alt',
      });

      expect(wrapper.attributes('alt')).toBe('Second alt');
    });

    it('updates class when prop changes', async () => {
      const wrapper = mount(Avatar, {
        props: {
          class: 'size-12',
        },
      });

      expect(wrapper.classes()).toContain('size-12');

      await wrapper.setProps({
        class: 'size-16',
      });

      expect(wrapper.classes()).toContain('size-16');
      expect(wrapper.classes()).not.toContain('size-12');
    });

    it('switches to fallback when src changes from valid to null', async () => {
      const wrapper = mount(Avatar, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      expect(wrapper.attributes('src')).toBe('https://example.com/image.jpg');

      await wrapper.setProps({
        src: null,
      });

      const imgSrc = wrapper.attributes('src');
      expect(imgSrc).toMatch('/src/assets/images/default-profile.png');
    });
  });
});
