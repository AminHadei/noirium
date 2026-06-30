import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Field, FieldDescription, FieldError, FieldLabel, Input } from '@/features/forms';

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Field, FieldLabel, FieldDescription, Input },
    template: `
      <div style="width: 320px;">
        <Field>
          <FieldLabel for="email">Email</FieldLabel>
          <Input id="email" placeholder="you@example.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </Field>
      </div>
    `,
  }),
};

export const WithError: Story = {
  render: () => ({
    components: { Field, FieldLabel, FieldError, Input },
    template: `
      <div style="width: 320px;">
        <Field>
          <FieldLabel for="email-error">Email</FieldLabel>
          <Input id="email-error" placeholder="you@example.com" />
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
      </div>
    `,
  }),
};
