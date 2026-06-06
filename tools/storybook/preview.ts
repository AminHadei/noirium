import type { Preview } from '@storybook/vue3-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './styles.css';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: 'bypass',
  // Relative path so GitHub Pages subpath deploy (/noirium/storybook/) resolves correctly.
  serviceWorker: { url: './mockServiceWorker.js' },
});

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  loaders: [mswLoader],
};

export default preview;
