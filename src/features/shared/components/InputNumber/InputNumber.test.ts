import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import InputNumber from './InputNumber.vue';

describe('InputNumber', () => {
  describe('Rendering', () => {
    it('should render number input', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.exists()).toBe(true);
    });

    it('should have inputmode="numeric"', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.attributes('inputmode')).toBe('numeric');
    });

    it('should have pattern="[0-9]*"', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.attributes('pattern')).toBe('[0-9]*');
    });

    it('should render with default null modelValue', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('');
    });

    it('should render with string modelValue', () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '123',
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('123');
    });

    it('should render with null modelValue', () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: null,
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('');
    });

    it('should render with undefined modelValue', () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: undefined,
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('');
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: 'Age',
        },
      });

      const label = wrapper.find('label');
      expect(label.exists()).toBe(true);
      expect(label.text()).toContain('Age');
    });

    it('should not render label when not provided', () => {
      const wrapper = mount(InputNumber);

      const label = wrapper.find('label');
      expect(label.exists()).toBe(false);
    });

    it('should not render label when empty string', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: '',
        },
      });

      const label = wrapper.find('label');
      expect(label.exists()).toBe(false);
    });

    it('should show required asterisk when required is true', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: 'Age',
          required: true,
        },
      });

      const label = wrapper.find('label');
      expect(label.html()).toContain('*');
      const asterisk = label.find('.text-destructive');
      expect(asterisk.exists()).toBe(true);
      expect(asterisk.text()).toBe('*');
    });

    it('should not show required asterisk when required is false', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: 'Age',
          required: false,
        },
      });

      const label = wrapper.find('label');
      const asterisk = label.find('.text-destructive');
      expect(asterisk.exists()).toBe(false);
    });

    it('should not show required asterisk when label is not provided', () => {
      const wrapper = mount(InputNumber, {
        props: {
          required: true,
        },
      });

      const asterisk = wrapper.find('.text-destructive');
      expect(asterisk.exists()).toBe(false);
    });

    it('should have correct label styling', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: 'Test Label',
        },
      });

      const label = wrapper.find('label');
      expect(label.classes()).toContain('text-sm');
      expect(label.classes()).toContain('font-semibold');
      expect(label.classes()).toContain('text-text-darker');
    });
  });

  describe('Placeholder', () => {
    it('should render with placeholder', () => {
      const wrapper = mount(InputNumber, {
        props: {
          placeholder: 'Enter your age',
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect(input.attributes('placeholder')).toBe('Enter your age');
    });

    it('should render with empty placeholder by default', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.attributes('placeholder')).toBe('');
    });

    it('should update placeholder when prop changes', async () => {
      const wrapper = mount(InputNumber, {
        props: {
          placeholder: 'First placeholder',
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect(input.attributes('placeholder')).toBe('First placeholder');

      await wrapper.setProps({ placeholder: 'Second placeholder' });
      expect(input.attributes('placeholder')).toBe('Second placeholder');
    });
  });

  describe('Events', () => {
    it('should emit update:modelValue on input', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('42');

      expect(updateSpy).toHaveBeenCalledWith('42');
    });

    it('should emit update:modelValue with string value', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '',
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('999');

      expect(updateSpy).toHaveBeenCalledWith('999');
    });

    it('should emit update:modelValue for each input change', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');

      await input.setValue('1');
      await input.setValue('12');
      await input.setValue('123');

      expect(updateSpy).toHaveBeenCalledTimes(3);
      expect(updateSpy).toHaveBeenNthCalledWith(1, '1');
      expect(updateSpy).toHaveBeenNthCalledWith(2, '12');
      expect(updateSpy).toHaveBeenNthCalledWith(3, '123');
    });

    it('should emit empty string when input is cleared', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '123',
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('');

      expect(updateSpy).toHaveBeenCalledWith('');
    });

    it('should handle input event correctly', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('456');

      expect(updateSpy).toHaveBeenCalledWith('456');
    });
  });

  describe('v-model', () => {
    it('should work with v-model', async () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '100',
          // oxlint-disable-next-line require-await
          'onUpdate:modelValue': async (value: string) => wrapper.setProps({ modelValue: value }),
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('100');

      await input.setValue('200');

      expect(wrapper.props('modelValue')).toBe('200');
      expect((input.element as HTMLInputElement).value).toBe('200');
    });

    it('should update input when modelValue prop changes', async () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '50',
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('50');

      await wrapper.setProps({ modelValue: '75' });
      expect((input.element as HTMLInputElement).value).toBe('75');

      await wrapper.setProps({ modelValue: '100' });
      expect((input.element as HTMLInputElement).value).toBe('100');
    });

    it('should handle changing from null to value', async () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: null,
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('');

      await wrapper.setProps({ modelValue: '25' });
      expect((input.element as HTMLInputElement).value).toBe('25');
    });

    it('should handle changing from value to null', async () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '25',
        },
      });

      const input = wrapper.find('input[type="number"]');
      expect((input.element as HTMLInputElement).value).toBe('25');

      await wrapper.setProps({ modelValue: null });
      expect((input.element as HTMLInputElement).value).toBe('');
    });
  });

  describe('Styling', () => {
    it('should have correct input styling classes', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.classes()).toContain('w-full');
      expect(input.classes()).toContain('px-5');
      expect(input.classes()).toContain('h-10');
      expect(input.classes()).toContain('rounded-lg');
    });

    it('should have border and transition classes', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      expect(input.classes()).toContain('border');
      expect(input.classes()).toContain('transition-all');
    });

    it('should have hover and focus classes', () => {
      const wrapper = mount(InputNumber);

      const input = wrapper.find('input[type="number"]');
      const classes = input.classes().join(' ');
      expect(classes).toContain('hover:border-');
      expect(classes).toContain('focus-visible:outline-none');
      expect(classes).toContain('focus-within:border-primary');
      expect(classes).toContain('focus-within:ring-2');
    });

    it('should have flex layout for container', () => {
      const wrapper = mount(InputNumber, {
        props: {
          label: 'Test',
        },
      });

      const container = wrapper.find('div');
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
      expect(container.classes()).toContain('gap-2');
    });
  });

  describe('Number Input Behavior', () => {
    it('should accept numeric values', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('12345');

      expect(updateSpy).toHaveBeenCalledWith('12345');
    });

    it('should accept negative numbers', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('-50');

      expect(updateSpy).toHaveBeenCalledWith('-50');
    });

    it('should accept decimal numbers', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('3.14');

      expect(updateSpy).toHaveBeenCalledWith('3.14');
    });

    it('should accept zero', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('0');

      expect(updateSpy).toHaveBeenCalledWith('0');
    });
  });

  describe('Props Defaults', () => {
    it('should have correct default values', () => {
      const wrapper = mount(InputNumber);

      expect(wrapper.props('modelValue')).toBeNull();
      expect(wrapper.props('label')).toBe('');
      expect(wrapper.props('required')).toBe(false);
      expect(wrapper.props('placeholder')).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');
      await input.setValue('999999999');

      expect(updateSpy).toHaveBeenCalledWith('999999999');
    });

    it('should handle rapid input changes', async () => {
      const updateSpy = vi.fn<() => void>();
      const wrapper = mount(InputNumber, {
        props: {
          'onUpdate:modelValue': updateSpy,
        },
      });

      const input = wrapper.find('input[type="number"]');

      await input.setValue('1');
      await input.setValue('12');
      await input.setValue('123');
      await input.setValue('1234');
      await input.setValue('12345');

      expect(updateSpy).toHaveBeenCalledTimes(5);
    });

    it('should work without any props', () => {
      const wrapper = mount(InputNumber);

      expect(wrapper.exists()).toBe(true);
      const input = wrapper.find('input[type="number"]');
      expect(input.exists()).toBe(true);
    });

    it('should handle all props together', () => {
      const wrapper = mount(InputNumber, {
        props: {
          modelValue: '42',
          label: 'Age',
          required: true,
          placeholder: 'Enter age',
        },
      });

      const input = wrapper.find('input[type="number"]');
      const label = wrapper.find('label');

      expect((input.element as HTMLInputElement).value).toBe('42');
      expect(input.attributes('placeholder')).toBe('Enter age');
      expect(label.text()).toContain('Age');
      expect(label.html()).toContain('*');
    });
  });
});
