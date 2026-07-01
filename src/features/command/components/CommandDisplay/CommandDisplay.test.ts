import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

import { CommandDisplay } from '@/features/command';

describe('CommandDisplay', () => {
  it('renders each command token as a highlighted span', () => {
    const wrapper = mount(CommandDisplay, { props: { command: 'pnpm add foo' } });
    const spans = wrapper.findAll('[data-slot="command-display"] span[class*="text-"]');

    expect(spans).toHaveLength(3);
    expect(wrapper.text()).toContain('pnpm');
    expect(wrapper.text()).toContain('add');
    expect(wrapper.text()).toContain('foo');
  });

  it('copies the command to the clipboard on click', async () => {
    const writeText = vi.fn<() => Promise<void>>().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(CommandDisplay, { props: { command: 'npm install noirium' } });
    await wrapper.find('button').trigger('click');

    expect(writeText).toHaveBeenCalledWith('npm install noirium');
  });
});
