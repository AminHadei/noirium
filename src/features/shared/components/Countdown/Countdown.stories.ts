import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Countdown } from '@/features/shared';

const meta = {
  title: 'Shared UI/Countdown',
  component: Countdown,
  tags: ['autodocs'],
  argTypes: {
    startDate: {
      control: 'date',
      description: 'The target date/time for the countdown (Full datetime string or Date object)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the calendar icon',
    },
    iconClass: {
      control: 'text',
      description: 'CSS classes for the icon',
    },
    textClass: {
      control: 'text',
      description: 'CSS classes for the countdown text',
    },
    updateInterval: {
      control: 'number',
      description: 'Update interval in milliseconds',
    },
    format: {
      control: 'select',
      options: ['short', 'long'],
      description: 'Format of the countdown text',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A reusable countdown component that displays time remaining until a target date/time. Shows all time units (days, hours, minutes, seconds) simultaneously and updates every second. Supports both Full datetime strings and Date objects, with customizable formatting and styling options.',
      },
    },
  },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create future dates
const getDateFromNow = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const Default: Story = {
  args: {
    startDate: getDateFromNow(30),
    showIcon: true,
    iconClass: 'i-calendar-bold size-4',
    textClass: 'text-text-light',
    updateInterval: 1000,
    format: 'short',
  },
};

export const Minutes: Story = {
  args: {
    startDate: getDateFromNow(45),
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays countdown with minutes and seconds (e.g., "Starts in 45m 0s").',
      },
    },
  },
};

export const Hours: Story = {
  args: {
    startDate: getDateFromNow(5 * 60),
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays countdown with hours, minutes, and seconds (e.g., "Starts in 5h 0m 0s").',
      },
    },
  },
};

export const Days: Story = {
  args: {
    startDate: getDateFromNow(3 * 24 * 60),
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays countdown with all units (e.g., "Starts in 3d 0h 0m 0s").',
      },
    },
  },
};

export const LongFormat: Story = {
  args: {
    startDate: getDateFromNow(90),
    showIcon: true,
    format: 'long',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses long format for countdown text (e.g., "Starts in 1 hour, 30 minutes, 0 seconds").',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    startDate: getDateFromNow(120),
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Countdown without the calendar icon.',
      },
    },
  },
};

export const CustomIcon: Story = {
  args: {
    startDate: getDateFromNow(60),
    showIcon: true,
    iconClass: 'i-clock-bold size-5',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses a custom icon (clock instead of calendar).',
      },
    },
  },
};

export const CustomTextStyle: Story = {
  args: {
    startDate: getDateFromNow(120),
    showIcon: true,
    textClass: 'text-primary font-semibold',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom text styling with primary color and bold font.',
      },
    },
  },
};

export const FullDateFormat: Story = {
  args: {
    startDate: '2026-01-27 14:00:00',
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Supports Full datetime string format (YYYY-MM-DD HH:MM:SS).',
      },
    },
  },
};

export const WithSeconds: Story = {
  args: {
    startDate: getDateFromNow(2),
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows live countdown with seconds updating in real-time (e.g., "Starts in 2m 0s").',
      },
    },
  },
};
