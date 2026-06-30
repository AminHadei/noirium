import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';

import { TableOfContents } from '@/features/navigation';

describe('TableOfContents', () => {
  it('renders manual items as anchor links', () => {
    const wrapper = mount(TableOfContents, {
      props: {
        data: [
          { id: 'intro', title: 'Introduction', depth: 2 },
          { id: 'cli', title: 'Using the CLI', depth: 3 },
        ],
      },
    });

    const links = wrapper.findAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]!.attributes('href')).toBe('#intro');
    expect(links[0]!.text()).toBe('Introduction');
    expect(links[1]!.attributes('href')).toBe('#cli');
  });
});
