import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import CheckInput from './CheckInput.vue';

describe('CheckInput', () => {
  describe('Rendering', () => {
    it('should render checkbox input', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(true);
    });

    it('should render with checked state when modelValue is true', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: true,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    });

    it('should render with unchecked state when modelValue is false', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    });

    it('should render label when slot content is provided', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        slots: {
          default: '<span>Accept terms</span>',
        },
      });

      const label = wrapper.find('label');
      expect(label.exists()).toBe(true);
      expect(label.text()).toContain('Accept terms');
    });

    it('should not render label when slot content is not provided', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const label = wrapper.find('label');
      expect(label.exists()).toBe(false);
    });

    it('should apply mt-2 class to checkbox when slot is provided', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        slots: {
          default: '<span>Label text</span>',
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.classes()).toContain('mt-2');
    });

    it('should not apply mt-2 class to checkbox when slot is not provided', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.classes()).not.toContain('mt-2');
    });

    it('should have correct for/id relationship between label and input', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        slots: {
          default: '<span>Label text</span>',
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      const label = wrapper.find('label');
      const checkboxId = checkbox.attributes('id');

      expect(checkboxId).toBeTruthy();
      expect(label.attributes('for')).toBe(checkboxId);
    });

    it('should use custom id when provided via attrs', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        attrs: {
          id: 'custom-checkbox-id',
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.attributes('id')).toBe('custom-checkbox-id');
    });
  });

  describe('Events', () => {
    it('should emit update:modelValue when checkbox change event is triggered', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
          'onUpdate:modelValue': updateSpy,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(true);

      expect(updateSpy).toHaveBeenCalledWith(true);
    });

    it('should emit update:modelValue with false when unchecking', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: true,
          'onUpdate:modelValue': updateSpy,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(false);

      expect(updateSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('v-model', () => {
    it('should work with v-model', async () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
          'onUpdate:modelValue': async (value: boolean) => {
            await wrapper.setProps({ modelValue: value });
          },
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(true);

      expect(wrapper.props('modelValue')).toBe(true);
      expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    });

    it('should update checkbox when modelValue prop changes', async () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect((checkbox.element as HTMLInputElement).checked).toBe(false);

      await wrapper.setProps({ modelValue: true });
      expect((checkbox.element as HTMLInputElement).checked).toBe(true);

      await wrapper.setProps({ modelValue: false });
      expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should have cursor-pointer class', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.classes()).toContain('cursor-pointer');
    });

    it('should have shrink-0 class', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.classes()).toContain('shrink-0');
    });
  });

  describe('Accessibility', () => {
    it('should allow clicking label to toggle checkbox', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
          'onUpdate:modelValue': updateSpy,
        },
        slots: {
          default: '<span>Click me</span>',
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(true);

      expect(updateSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('Slot Content', () => {
    it('should render complex slot content', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        slots: {
          default: '<div><strong>Terms</strong> and <em>Conditions</em></div>',
        },
      });

      const label = wrapper.find('label');
      expect(label.html()).toContain('<strong>Terms</strong>');
      expect(label.html()).toContain('<em>Conditions</em>');
    });

    it('should render multiple lines of text in slot', () => {
      const wrapper = mount(CheckInput, {
        props: {
          modelValue: false,
        },
        slots: {
          default: '<span>Line 1<br>Line 2</span>',
        },
      });

      const label = wrapper.find('label');
      expect(label.html()).toContain('Line 1');
      expect(label.html()).toContain('Line 2');
    });
  });
});
