import { mount, type DOMWrapper } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from '@/features/navigation';

const Harness = {
  components: { Accordion, AccordionItem, AccordionHeader, AccordionContent },
  template: `
    <Accordion :type="type">
      <AccordionItem value="a">
        <AccordionHeader>First</AccordionHeader>
        <AccordionContent>First body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionHeader>Second</AccordionHeader>
        <AccordionContent>Second body</AccordionContent>
      </AccordionItem>
    </Accordion>
  `,
  props: { type: { type: String, default: 'single' } },
};

const shown = (wrapper: DOMWrapper<Element>): boolean =>
  !(wrapper.attributes('style') ?? '').includes('display: none');

describe('Accordion', () => {
  it('toggles a single panel open and closed', async () => {
    const wrapper = mount(Harness);
    const firstContent = (): DOMWrapper<Element> =>
      wrapper.findAll('[data-slot="accordion-content"]')[0]!;
    const trigger = (): DOMWrapper<Element> =>
      wrapper.findAll('[data-slot="accordion-trigger"]')[0]!;

    expect(shown(firstContent())).toBe(false);

    await trigger().trigger('click');
    expect(shown(firstContent())).toBe(true);

    await trigger().trigger('click');
    expect(shown(firstContent())).toBe(false);
  });

  it('keeps only one panel open in single mode', async () => {
    const wrapper = mount(Harness);
    const triggers = wrapper.findAll('[data-slot="accordion-trigger"]');
    const contents = (): DOMWrapper<Element>[] =>
      wrapper.findAll('[data-slot="accordion-content"]');

    await triggers[0]!.trigger('click');
    await triggers[1]!.trigger('click');

    expect(shown(contents()[0]!)).toBe(false);
    expect(shown(contents()[1]!)).toBe(true);
  });
});
