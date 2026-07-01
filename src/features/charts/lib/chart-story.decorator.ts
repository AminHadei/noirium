import type { Decorator, Meta } from '@storybook/vue3-vite';

/**
 * Mirrors `playground/playground-layout.css` chart hosts so Storybook matches the
 * playground section: shell background, white card, and a 20rem-tall chart area.
 */
export const chartStoryDecorator: Decorator = () => ({
  template: `
    <div
      style="
        width: 100%;
        max-width: 48rem;
        padding: 1rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 1rem;
      "
    >
      <div style="width: 100%; height: 20rem; min-height: 20rem;">
        <story />
      </div>
    </div>
  `,
});

export const chartStoryParameters: Meta['parameters'] = {
  layout: 'padded',
  backgrounds: { default: 'playground' },
};
