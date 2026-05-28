import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Avatar } from '@/features/shared';

const meta = {
  title: 'Shared UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'The image source URL. Falls back to fallback-image.svg if missing or on error.',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the image',
    },
    class: {
      control: 'text',
      description: 'Additional CSS classes to apply to the image',
    },
  },
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    alt: 'User avatar',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    alt: 'User avatar',
    class: 'size-12 rounded-full',
  },
  render: (args): object => ({
    components: {
      Avatar,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<Avatar v-bind="args" />',
  }),
};

export const WithoutImage: Story = {
  args: {
    src: null,
    alt: 'User avatar',
    class: 'size-12 rounded-full',
  },
  render: (args): object => ({
    components: {
      Avatar,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<Avatar v-bind="args" />',
  }),
};

export const EmptySrc: Story = {
  args: {
    src: '',
    alt: 'User avatar',
    class: 'size-12 rounded-full',
  },
  render: (args): object => ({
    components: {
      Avatar,
    },
    setup(): object {
      return {
        args,
      };
    },
    template: '<Avatar v-bind="args" />',
  }),
};

export const DifferentSizes: Story = {
  render: () => ({
    components: {
      Avatar,
    },
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; padding: 2rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=1" alt="Small avatar" class="size-8 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">8x8 (32px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=2" alt="Medium avatar" class="size-12 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">12x12 (48px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="Large avatar" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">16x16 (64px)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=4" alt="XLarge avatar" class="size-20 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">20x20 (80px)</span>
        </div>
      </div>
    `,
  }),
};

export const DifferentShapes: Story = {
  render: () => ({
    components: {
      Avatar,
    },
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; padding: 2rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=5" alt="Rounded avatar" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">Rounded Full</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=6" alt="Rounded avatar" class="size-16 rounded-lg" />
          <span style="font-size: 0.75rem; color: #666;">Rounded Large</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=7" alt="Square avatar" class="size-16 rounded" />
          <span style="font-size: 0.75rem; color: #666;">Rounded</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=8" alt="Square avatar" class="size-16" />
          <span style="font-size: 0.75rem; color: #666;">Square</span>
        </div>
      </div>
    `,
  }),
};

export const WithFallback: Story = {
  render: () => ({
    components: {
      Avatar,
    },
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; padding: 2rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://i.pravatar.cc/150?img=9" alt="With image" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">With Image</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="" alt="No image" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">No Image (Fallback)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar :src="null" alt="Null src" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">Null Src (Fallback)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar src="https://invalid-url-that-does-not-exist.com/image.jpg" alt="Error" class="size-16 rounded-full" />
          <span style="font-size: 0.75rem; color: #666;">Error (Fallback)</span>
        </div>
      </div>
    `,
  }),
};

export const WithCustomClasses: Story = {
  render: () => ({
    components: {
      Avatar,
    },
    template: `
      <div style="display: flex; gap: 2rem; align-items: center; padding: 2rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar
            src="https://i.pravatar.cc/150?img=10"
            alt="Bordered avatar"
            class="size-16 rounded-full border-2 border-primary"
          />
          <span style="font-size: 0.75rem; color: #666;">With Border</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar
            src="https://i.pravatar.cc/150?img=11"
            alt="Shadow avatar"
            class="size-16 rounded-full shadow-lg"
          />
          <span style="font-size: 0.75rem; color: #666;">With Shadow</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Object cover"
            class="size-16 rounded-full object-cover"
          />
          <span style="font-size: 0.75rem; color: #666;">Object Cover</span>
        </div>
      </div>
    `,
  }),
};

export const InContext: Story = {
  render: () => ({
    components: {
      Avatar,
    },
    template: `
      <div style="padding: 2rem; background: #f5f5f5; border-radius: 8px;">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px;">
            <Avatar src="https://i.pravatar.cc/150?img=13" alt="John Doe" class="size-12 rounded-full object-cover" />
            <div>
              <div style="font-weight: 600; font-size: 1rem;">John Doe</div>
              <div style="font-size: 0.875rem; color: #666;">Software Engineer</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px;">
            <Avatar src="" alt="Jane Smith" class="size-12 rounded-full object-cover" />
            <div>
              <div style="font-weight: 600; font-size: 1rem;">Jane Smith</div>
              <div style="font-size: 0.875rem; color: #666;">Product Designer</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px;">
            <Avatar src="https://i.pravatar.cc/150?img=15" alt="Bob Johnson" class="size-12 rounded-full object-cover" />
            <div>
              <div style="font-weight: 600; font-size: 1rem;">Bob Johnson</div>
              <div style="font-size: 0.875rem; color: #666;">Data Scientist</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
