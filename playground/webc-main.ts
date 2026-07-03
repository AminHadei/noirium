import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './src/style.css';
import './playground-layout.css';
import { ToastProvider } from 'noirium/ui';
import { createApp, h, type Component } from 'vue';

import App from './src/App.vue';
import './webc-loader';

createApp({
  render: () =>
    h(ToastProvider, null, {
      default: () =>
        h(App as unknown as Component, {
          playgroundTitle: 'Noirium UI — Web Components Playground',
        }),
    }),
}).mount('#app');
