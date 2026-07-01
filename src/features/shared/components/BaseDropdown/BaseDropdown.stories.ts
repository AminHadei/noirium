import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import PrimaryButton from '../PrimaryButton/PrimaryButton.vue';
import BaseDropdown from './BaseDropdown.vue';
import type { BaseDropdownItem } from './types';

const meta = {
  title: 'Forms/BaseDropdown',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A dropdown component for selecting items from a list.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedItem = ref<BaseDropdownItem | null>(null);
      const items: BaseDropdownItem[] = [
        {
          id: 1,
          label: 'Profile',
        },
        {
          id: 2,
          label: 'Settings',
        },
        {
          id: 3,
          label: 'Help Center',
        },
        {
          id: 4,
          label: 'Logout',
        },
      ];
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown v-model="selectedItem" :items="items">
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Select an option' }}
          </PrimaryButton>
        </BaseDropdown>

        <div v-if="selectedItem" class="mt-4 text-sm text-gray-600">
          Selected: {{ selectedItem.label }} (ID: {{ selectedItem.id }})
        </div>
      </div>
    `,
  }),
};

export const WithDisabledItems: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedItem = ref<BaseDropdownItem | null>(null);
      const items: BaseDropdownItem[] = [
        {
          id: 1,
          label: 'Available Option 1',
        },
        {
          id: 2,
          label: 'Disabled Option',
          disabled: true,
        },
        {
          id: 3,
          label: 'Available Option 2',
        },
        {
          id: 4,
          label: 'Another Disabled',
          disabled: true,
        },
        {
          id: 5,
          label: 'Available Option 3',
        },
      ];
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown v-model="selectedItem" :items="items">
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Select an option' }}
          </PrimaryButton>
        </BaseDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Try using keyboard navigation (Arrow keys, Enter, Space, Escape)
        </p>
      </div>
    `,
  }),
};

export const CustomItemSlot: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      interface UserItem extends BaseDropdownItem {
        email: string;
        avatar: string;
      }

      const selectedUser = ref<UserItem | null>(null);
      const users: UserItem[] = [
        {
          id: 1,
          label: 'John Doe',
          email: 'john@example.com',
          avatar: '👨',
        },
        {
          id: 2,
          label: 'Jane Smith',
          email: 'jane@example.com',
          avatar: '👩',
        },
        {
          id: 3,
          label: 'Bob Johnson',
          email: 'bob@example.com',
          avatar: '👨‍💼',
        },
        {
          id: 4,
          label: 'Alice Williams',
          email: 'alice@example.com',
          avatar: '👩‍💼',
        },
      ];
      return {
        selectedUser,
        users,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown v-model="selectedUser" :items="users" min-width="280px">
          <PrimaryButton>
            {{ selectedUser ? selectedUser.label : 'Select a user' }}
          </PrimaryButton>

          <template #item="{ item, isSelected }">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ item.avatar }}</span>
              <div class="flex-1">
                <div class="font-semibold" :class="{ 'text-primary': isSelected }">
                  {{ item.label }}
                </div>
                <div class="text-xs text-gray-500">{{ item.email }}</div>
              </div>
              <span v-if="isSelected" class="text-primary text-lg">✓</span>
            </div>
          </template>
        </BaseDropdown>
      </div>
    `,
  }),
};

export const LargeList: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedItem = ref<BaseDropdownItem | null>(null);
      const items: BaseDropdownItem[] = Array.from(
        {
          length: 50,
        },
        (_, i) => ({
          id: i + 1,
          label: `Option ${i + 1}`,
          disabled: i % 7 === 0,
        }),
      );
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown v-model="selectedItem" :items="items" max-height="250px">
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Select from 50 options' }}
          </PrimaryButton>
        </BaseDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Scrollable list with 50 items. Try keyboard navigation: Home, End, Arrow keys.
        </p>
      </div>
    `,
  }),
};

export const TopPlacement: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedItem = ref<BaseDropdownItem | null>(null);
      const items: BaseDropdownItem[] = [
        {
          id: 1,
          label: 'Option 1',
        },
        {
          id: 2,
          label: 'Option 2',
        },
        {
          id: 3,
          label: 'Option 3',
        },
        {
          id: 4,
          label: 'Option 4',
        },
      ];
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8 pt-64">
        <BaseDropdown v-model="selectedItem" :items="items" placement="top">
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Opens upward' }}
          </PrimaryButton>
        </BaseDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Dropdown opens above the trigger
        </p>
      </div>
    `,
  }),
};

export const KeepOpenOnSelect: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const selectedItem = ref<BaseDropdownItem | null>(null);
      const items: BaseDropdownItem[] = [
        {
          id: 1,
          label: 'Apple',
        },
        {
          id: 2,
          label: 'Banana',
        },
        {
          id: 3,
          label: 'Cherry',
        },
        {
          id: 4,
          label: 'Date',
        },
        {
          id: 5,
          label: 'Elderberry',
        },
      ];
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown
          v-model="selectedItem"
          :items="items"
          :close-on-select="false"
        >
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Select (stays open)' }}
          </PrimaryButton>
        </BaseDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Dropdown stays open after selection. Press Escape or click outside to close.
        </p>
      </div>
    `,
  }),
};

export const WithPreselectedValue: Story = {
  render: () => ({
    components: {
      BaseDropdown,
      PrimaryButton,
    },
    setup(): object {
      const items: BaseDropdownItem[] = [
        {
          id: 1,
          label: 'Red',
        },
        {
          id: 2,
          label: 'Green',
        },
        {
          id: 3,
          label: 'Blue',
        },
        {
          id: 4,
          label: 'Yellow',
        },
      ];
      const selectedItem = ref(items[1] ?? null);
      return {
        selectedItem,
        items,
      };
    },
    template: `
      <div class="p-8">
        <BaseDropdown v-model="selectedItem" :items="items">
          <PrimaryButton>
            {{ selectedItem ? selectedItem.label : 'Select a color' }}
          </PrimaryButton>
        </BaseDropdown>

        <p class="mt-4 text-sm text-gray-600">
          Starts with "Green" preselected
        </p>
      </div>
    `,
  }),
};
