import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './src/style.css';
import './playground-layout.css';
import { createApp } from 'vue';

import App from './src/App.vue';
import './webc-loader';

createApp(App, {
  playgroundTitle: 'Noirium UI — Web Components Playground',
}).mount('#app');
