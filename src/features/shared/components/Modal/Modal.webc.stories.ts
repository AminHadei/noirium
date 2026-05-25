import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  loadWebcBundle,
  renderMissingBundleBanner,
  type LoadResult,
} from '@/features/shared/lib/utils/webc-story-helpers';

const TAG = 'noirium-modal';
const BUNDLE_URL = '/webc-bundles/modal.js';

interface WebcArgs {
  layout: 'default' | 'fullscreen';
  title: string;
  closable: boolean;
  showCloseButton: boolean;
  modalOnly: boolean;
  body: string;
}

const renderWebc = (args: WebcArgs): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '1rem';
  wrapper.innerHTML = `
    <button id="open-btn" type="button" style="padding: 0.5rem 1rem;">Open Modal</button>
    <${TAG}
      id="webc-modal"
      layout="${args.layout}"
      title="${args.title}"
      ${args.closable ? '' : ':closable="false"'}
      ${args.showCloseButton ? '' : ':show-close-button="false"'}
      ${args.modalOnly ? '' : ':modal-only="false"'}
    >
      <p>${args.body}</p>
    </${TAG}>
  `;
  queueMicrotask(() => {
    const btn = wrapper.querySelector<HTMLButtonElement>('#open-btn');
    const modal = wrapper.querySelector<HTMLElement>('#webc-modal');
    if (!btn || !modal) return;
    btn.addEventListener('click', () => {
      modal.setAttribute('visible', '');
    });
    modal.addEventListener('close', () => {
      modal.removeAttribute('visible');
    });
  });
  return wrapper;
};

const meta: Meta<WebcArgs> = {
  title: 'Web Components/Modal (webc)',
  tags: ['webc'],
  loaders: [
    async (): Promise<LoadResult> => {
      const result = await loadWebcBundle(TAG, BUNDLE_URL);
      return result;
    },
  ],
  argTypes: {
    layout: { control: 'radio', options: ['default', 'fullscreen'] },
    title: { control: 'text' },
    closable: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    modalOnly: { control: 'boolean' },
    body: { control: 'text' },
  },
  args: {
    layout: 'default',
    title: 'Important Message',
    closable: true,
    showCloseButton: true,
    modalOnly: true,
    body: 'Modal content rendered through Shadow DOM.',
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

export const Default: Story = {};

export const Fullscreen: Story = {
  args: { layout: 'fullscreen', title: 'Fullscreen' },
};

export const NotClosable: Story = {
  args: { closable: false, title: 'Persistent' },
};
