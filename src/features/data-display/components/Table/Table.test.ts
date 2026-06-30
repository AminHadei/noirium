import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { h } from 'vue';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/data-display';

describe('Table', () => {
  it('renders its composed parts inside a table element', () => {
    const wrapper = mount(Table, {
      slots: {
        default: () => [
          h(TableCaption, () => 'Caption'),
          h(TableHeader, () => h(TableRow, () => h(TableHead, () => 'Name'))),
          h(TableBody, () => h(TableRow, () => h(TableCell, () => 'Alice'))),
        ],
      },
    });

    expect(wrapper.find('table[data-slot="table"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="table-caption"]').text()).toBe('Caption');
    expect(wrapper.find('[data-slot="table-head"]').text()).toBe('Name');
    expect(wrapper.find('[data-slot="table-cell"]').text()).toBe('Alice');
  });
});
