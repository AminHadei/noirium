import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import { ref } from 'vue';

import { CountryDropdown, PrimaryButton } from '@/features/shared';

import type { Iso2 } from '../PhoneNumberInput/data';

const meta = {
  title: 'Forms/CountryDropdown',
  component: CountryDropdown,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected country code (ISO2)',
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of dropdown (CSS value)',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of dropdown (CSS value)',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether to close dropdown after selecting a country',
    },
  },
  args: {
    minWidth: '400px',
    maxHeight: '300px',
    closeOnSelect: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown component for selecting countries with flags, names, and phone codes.',
      },
    },
  },
} satisfies Meta<typeof CountryDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): object => ({
    components: {
      CountryDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedCountry = ref<Iso2 | null>('us');

      return {
        args,
        selectedCountry,
        onSelect: fn(),
      };
    },
    template: `
      <div class="p-8">
        <CountryDropdown
          v-model="selectedCountry"
          v-bind="args"
          @select="onSelect"
        >
          <PrimaryButton>
            {{ selectedCountry ? selectedCountry.toUpperCase() : 'Select Country' }}
          </PrimaryButton>
        </CountryDropdown>

        <div v-if="selectedCountry" class="mt-4 text-sm text-gray-600">
          Selected: {{ selectedCountry.toUpperCase() }}
        </div>
      </div>
    `,
  }),
};

export const WithCustomWidth: Story = {
  render: (args): object => ({
    components: {
      CountryDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedCountry = ref<Iso2 | null>('us');

      return {
        args,
        selectedCountry,
      };
    },
    template: `
      <div class="p-8">
        <CountryDropdown
          v-model="selectedCountry"
          v-bind="args"
          min-width="300px"
        >
          <PrimaryButton>
            {{ selectedCountry ? selectedCountry.toUpperCase() : 'Select Country' }}
          </PrimaryButton>
        </CountryDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Custom width: 300px (narrower than default 400px)
        </p>
      </div>
    `,
  }),
};

export const PreSelected: Story = {
  render: (args): object => ({
    components: {
      CountryDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedCountry = ref<Iso2 | null>('gb');

      return {
        args,
        selectedCountry,
      };
    },
    template: `
      <div class="p-8">
        <CountryDropdown
          v-model="selectedCountry"
          v-bind="args"
        >
          <PrimaryButton>
            {{ selectedCountry ? selectedCountry.toUpperCase() : 'Select Country' }}
          </PrimaryButton>
        </CountryDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Pre-selected with United Kingdom (GB)
        </p>
      </div>
    `,
  }),
};

export const KeepOpenOnSelect: Story = {
  render: (args): object => ({
    components: {
      CountryDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedCountry = ref<Iso2 | null>(null);

      return {
        args,
        selectedCountry,
      };
    },
    template: `
      <div class="p-8">
        <CountryDropdown
          v-model="selectedCountry"
          v-bind="args"
          :close-on-select="false"
        >
          <PrimaryButton>
            {{ selectedCountry ? selectedCountry.toUpperCase() : 'Select Countries' }}
          </PrimaryButton>
        </CountryDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Dropdown stays open after selection (useful for comparing countries)
        </p>
      </div>
    `,
  }),
};
