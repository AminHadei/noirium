import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vite-plus/test';
import { nextTick } from 'vue';

import PhoneNumberInput from './PhoneNumberInput.vue';

const lastCallArg = (spy: ReturnType<typeof vi.fn>): unknown => spy.mock.calls.at(-1)?.[0];

describe('PhoneNumberInput', () => {
  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      wrapper = mount(PhoneNumberInput);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('input[type="tel"]').exists()).toBeTruthy();
      expect(wrapper.find('button').exists()).toBeTruthy();
    });

    it('should render flag icon when country is selected', () => {
      wrapper = mount(PhoneNumberInput, {
        props: { countryCode: 'us' },
      });

      const flagButton = wrapper.find('button');
      expect(flagButton.exists()).toBe(true);
      expect(flagButton.find('img').exists()).toBe(true);
    });

    it('should render placeholder flag when no country is selected', () => {
      wrapper = mount(PhoneNumberInput, {
        props: { countryCode: null },
      });

      expect(wrapper.find('button img').exists()).toBe(false);
      expect(wrapper.find('button div[aria-label]').exists()).toBe(true);
    });

    it('should render label and required asterisk', () => {
      wrapper = mount(PhoneNumberInput, {
        props: { label: 'Phone', required: true },
      });

      expect(wrapper.find('label').text()).toContain('Phone');
      expect(wrapper.find('label span').text()).toBe('*');
    });

    it('should render error message when error is provided', () => {
      wrapper = mount(PhoneNumberInput, {
        props: { error: 'Invalid number' },
      });

      expect(wrapper.text()).toContain('Invalid number');
    });

    it('should use provided id from attrs', () => {
      wrapper = mount(PhoneNumberInput, {
        attrs: { id: 'my-phone' },
        props: { label: 'Phone' },
      });

      expect(wrapper.find('input').attributes('id')).toBe('my-phone');
      expect(wrapper.find('label').attributes('for')).toBe('my-phone');
    });
  });

  describe('Phone input parsing and emission', () => {
    interface PhoneEvent {
      countryCode: string | null;
      phoneNumber: string;
      fullNumber: string;
    }

    const mountWithSpies = (
      props: Record<string, unknown> = {},
    ): {
      onUpdateModelValue: ReturnType<typeof vi.fn>;
      onUpdatePhoneNumber: ReturnType<typeof vi.fn>;
      onUpdateCountryCode: ReturnType<typeof vi.fn>;
      clearError: ReturnType<typeof vi.fn>;
    } => {
      const onUpdateModelValue = vi.fn<(arg?: unknown) => void>();
      const onUpdatePhoneNumber = vi.fn<(arg?: unknown) => void>();
      const onUpdateCountryCode = vi.fn<(arg?: unknown) => void>();
      const clearError = vi.fn<(arg?: unknown) => void>();
      wrapper = mount(PhoneNumberInput, {
        props: {
          countryCode: 'us',
          ...props,
          'onUpdate:modelValue': onUpdateModelValue,
          'onUpdate:phoneNumber': onUpdatePhoneNumber,
          'onUpdate:countryCode': onUpdateCountryCode,
          clearError,
        },
      });
      return { onUpdateModelValue, onUpdatePhoneNumber, onUpdateCountryCode, clearError };
    };

    it('emits "+" when input is exactly "+"', async () => {
      const { onUpdateModelValue, onUpdatePhoneNumber, clearError } = mountWithSpies();

      await wrapper.find('input[type="tel"]').setValue('+');

      expect(lastCallArg(onUpdateModelValue)).toBe('+');
      expect(lastCallArg(onUpdatePhoneNumber) as PhoneEvent).toMatchObject({
        phoneNumber: '',
        fullNumber: '+',
      });
      expect(clearError).toHaveBeenCalled();
    });

    it('parses a US number and emits parsed parts', async () => {
      const { onUpdateModelValue, onUpdatePhoneNumber } = mountWithSpies();

      await wrapper.find('input[type="tel"]').setValue('+13055551234');

      expect(lastCallArg(onUpdateModelValue)).toBe('+13055551234');
      expect(lastCallArg(onUpdatePhoneNumber) as PhoneEvent).toMatchObject({
        countryCode: 'us',
        phoneNumber: '3055551234',
        fullNumber: '+13055551234',
      });
    });

    it('strips non-digit characters from input', async () => {
      const { onUpdateModelValue } = mountWithSpies();

      await wrapper.find('input[type="tel"]').setValue('+1 (305) 555-1234');

      expect(lastCallArg(onUpdateModelValue)).toBe('+13055551234');
    });

    it('switches selectedCountry when a different country code is typed', async () => {
      const { onUpdateCountryCode } = mountWithSpies();

      await wrapper.find('input[type="tel"]').setValue('+44123456');

      expect(lastCallArg(onUpdateCountryCode)).toBe('gb');
    });

    it('falls back to current country when input has no leading +', async () => {
      const { onUpdateModelValue } = mountWithSpies();

      await wrapper.find('input[type="tel"]').setValue('5551234');

      expect(lastCallArg(onUpdateModelValue)).toBe('+15551234');
    });

    it('handles unknown country prefix using regex fallback', async () => {
      const { onUpdateModelValue } = mountWithSpies({ countryCode: null });

      await wrapper.find('input[type="tel"]').setValue('+99991234');

      expect(lastCallArg(onUpdateModelValue)).toBe('+99991234');
    });

    it('emits unprefixed number when no + and no current country', async () => {
      const { onUpdateModelValue } = mountWithSpies({ countryCode: null });

      await wrapper.find('input[type="tel"]').setValue('5551234');

      expect(lastCallArg(onUpdateModelValue)).toBe('5551234');
    });
  });

  describe('Country selection from dropdown', () => {
    it('updates phoneInput and emits when country selected via dropdown', async () => {
      const onUpdateCountryCode = vi.fn<(arg?: unknown) => void>();
      const onUpdateModelValue = vi.fn<(arg?: unknown) => void>();
      wrapper = mount(PhoneNumberInput, {
        props: {
          countryCode: 'us',
          'onUpdate:countryCode': onUpdateCountryCode,
          'onUpdate:modelValue': onUpdateModelValue,
        },
      });

      await wrapper.find('input[type="tel"]').setValue('+13055551234');

      const dropdown = wrapper.findComponent({ name: 'CountryDropdown' });
      const vnodeProps = (
        dropdown.vm as unknown as { $: { vnode: { props: Record<string, unknown> } } }
      ).$.vnode.props;
      const handler = vnodeProps['onSelect'] as (c: string) => void;
      handler('gb');
      await nextTick();

      expect(onUpdateCountryCode.mock.calls.at(-1)?.[0]).toBe('gb');
      expect(onUpdateModelValue.mock.calls.at(-1)?.[0]).toMatch(/^\+44/);
    });

    it('ignores null country selection', async () => {
      const onUpdateCountryCode = vi.fn<(arg?: unknown) => void>();
      wrapper = mount(PhoneNumberInput, {
        props: {
          countryCode: 'us',
          'onUpdate:countryCode': onUpdateCountryCode,
        },
      });

      const dropdown = wrapper.findComponent({ name: 'CountryDropdown' });
      const vnodeProps = (
        dropdown.vm as unknown as { $: { vnode: { props: Record<string, unknown> } } }
      ).$.vnode.props;
      const handler = vnodeProps['onSelect'] as (c: string | null) => void;
      handler(null);
      await nextTick();

      expect(onUpdateCountryCode).not.toHaveBeenCalled();
    });
  });
});
