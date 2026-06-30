import { mount, type DOMWrapper } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/navigation';

const Harness = {
  components: { Tabs, TabsList, TabsTrigger, TabsContent },
  template: `
    <Tabs default-value="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
  `,
};

const shown = (wrapper: DOMWrapper<Element>): boolean =>
  !(wrapper.attributes('style') ?? '').includes('display: none');

describe('Tabs', () => {
  it('shows the default panel and switches on trigger click', async () => {
    const wrapper = mount(Harness);
    const panels = (): DOMWrapper<Element>[] => wrapper.findAll('[data-slot="tabs-content"]');

    expect(shown(panels()[0]!)).toBe(true);
    expect(shown(panels()[1]!)).toBe(false);

    await wrapper.findAll('[data-slot="tabs-trigger"]')[1]!.trigger('click');

    expect(shown(panels()[0]!)).toBe(false);
    expect(shown(panels()[1]!)).toBe(true);
    expect(wrapper.findAll('[data-slot="tabs-trigger"]')[1]!.attributes('aria-selected')).toBe(
      'true',
    );
  });
});
