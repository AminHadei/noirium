import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from '@/features/navigation';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
  },
  args: {
    type: 'single',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): object => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionContent },
    setup: (): object => ({ args }),
    template: `
      <Accordion :type="args.type" style="max-width: 480px;">
        <AccordionItem value="item-1">
          <AccordionHeader>Is it accessible?</AccordionHeader>
          <AccordionContent>Yes. It uses aria-expanded and keyboard-focusable triggers.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionHeader>Is it styled?</AccordionHeader>
          <AccordionContent>Yes, with the Noirium theme tokens.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionHeader>Is it animated?</AccordionHeader>
          <AccordionContent>The chevron rotates and the panel toggles.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
};

export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args): object => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionContent },
    setup: (): object => ({ args }),
    template: `
      <Accordion :type="args.type" style="max-width: 480px;">
        <AccordionItem value="a">
          <AccordionHeader>Section A</AccordionHeader>
          <AccordionContent>Multiple sections can stay open at once.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>Section B</AccordionHeader>
          <AccordionContent>Open A and B together.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
};
