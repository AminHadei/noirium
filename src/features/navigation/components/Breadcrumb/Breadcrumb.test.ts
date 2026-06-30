import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { h } from 'vue';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/features/navigation';

describe('Breadcrumb', () => {
  it('renders a labelled trail with a current page', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: () =>
          h(BreadcrumbList, () => [
            h(BreadcrumbItem, () => h(BreadcrumbLink, { href: '/' }, () => 'Home')),
            h(BreadcrumbSeparator),
            h(BreadcrumbItem, () => h(BreadcrumbPage, () => 'Current')),
          ]),
      },
    });

    expect(wrapper.attributes('aria-label')).toBe('breadcrumb');
    expect(wrapper.find('[data-slot="breadcrumb-link"]').attributes('href')).toBe('/');
    expect(wrapper.find('[data-slot="breadcrumb-page"]').attributes('aria-current')).toBe('page');
    expect(wrapper.find('[data-slot="breadcrumb-separator"]').exists()).toBe(true);
  });
});
