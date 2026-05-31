import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import './style.css';

const theme: Theme = {
  extends: DefaultTheme,
};

// eslint-disable-next-line import/no-default-export
export default theme;
