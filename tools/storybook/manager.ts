import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: '<p>Noirium UI</p>',
    brandUrl: 'https://github.com/noirium',
  }),
});
