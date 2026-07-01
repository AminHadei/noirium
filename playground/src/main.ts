import '../playground-layout.css';
import './style.css';
import 'virtual:uno.css';
import { ToastProvider } from 'noirium/ui';
import { createApp, h, type Component } from 'vue';

import App from './App.vue';

const app = createApp({
  render: () =>
    h(ToastProvider, null, {
      default: () => h(App as unknown as Component),
    }),
});
app.mount('#app');
