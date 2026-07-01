import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vite-plus/test';

vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChartStub',
    template: '<div data-test="vchart-stub" />',
  },
}));

import { BarChart, LineChart, PieChart } from '@/features/charts';

const sample = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
];

describe('Charts', () => {
  it('renders a bar chart container', () => {
    const wrapper = mount(BarChart, {
      props: { data: sample, index: 'month', categories: ['desktop'] },
    });
    expect(wrapper.find('[data-slot="bar-chart"]').exists()).toBe(true);
  });

  it('renders a line chart container', () => {
    const wrapper = mount(LineChart, {
      props: { data: sample, index: 'month', categories: ['desktop'] },
    });
    expect(wrapper.find('[data-slot="line-chart"]').exists()).toBe(true);
  });

  it('renders a pie chart container', () => {
    const wrapper = mount(PieChart, {
      props: {
        data: [{ name: 'A', value: 10 }],
        dataKey: 'value',
        nameKey: 'name',
      },
    });
    expect(wrapper.find('[data-slot="pie-chart"]').exists()).toBe(true);
  });
});
