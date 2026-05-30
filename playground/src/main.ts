import './style.css';
import 'virtual:uno.css';
import { createApp, type Component } from 'vue';

import 'noirium/style.css';
import App from './App.vue';

const app = createApp(App as unknown as Component);
// app.use(CoreUI);
app.mount('#app');
