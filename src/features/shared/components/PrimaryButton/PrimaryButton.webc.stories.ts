import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  loadWebcBundle,
  renderMissingBundleBanner,
  type LoadResult,
} from '@/features/shared/lib/utils/webc-story-helpers';

const TAG = 'noirium-primary-button';
const BUNDLE_URL = '/webc-bundles/primary-button.js';

interface WebcArgs {
  variant: 'primary' | 'outline' | 'text';
  label: string;
  disabled: boolean;
  loading: boolean;
  showChevron: boolean;
}

const renderWebc = (args: WebcArgs): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '1rem';
  wrapper.innerHTML = `
    <${TAG}
      variant="${args.variant}"
      ${args.disabled ? 'disabled' : ''}
      ${args.loading ? 'loading' : ''}
      ${args.showChevron ? '' : ':show-chevron="false"'}
    >${args.label}</${TAG}>
  `;
  return wrapper;
};

const meta: Meta<WebcArgs> = {
  title: 'Web Components/PrimaryButton (webc)',
  tags: ['webc'],
  loaders: [
    async (): Promise<LoadResult> => {
      const result = await loadWebcBundle(TAG, BUNDLE_URL);
      return result;
    },
  ],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'outline', 'text'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    showChevron: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    label: 'Click me',
    disabled: false,
    loading: false,
    showChevron: true,
  },
  render: (args, context): object => ({
    setup: (): { args: WebcArgs } => ({ args }),
    template: '<div ref="root"></div>',
    mounted(): void {
      const { bundleError } = context.loaded as LoadResult;
      const root = (this as unknown as { $refs: { root: HTMLElement } }).$refs.root;
      root.replaceChildren(
        bundleError === null ? renderWebc(args) : renderMissingBundleBanner(bundleError),
      );
    },
  }),
};

export default meta;
type Story = StoryObj<WebcArgs>;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Get Started' },
};
export const Outline: Story = {
  args: { variant: 'outline', label: 'Learn More' },
};
export const Text: Story = {
  args: { variant: 'text', label: 'View Details' },
};
