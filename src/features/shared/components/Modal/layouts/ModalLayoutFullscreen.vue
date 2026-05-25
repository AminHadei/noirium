<script lang="ts" setup>
  import { computed, useSlots } from 'vue';

  import { useModalContext } from '@/features/shared/components/Modal/Modal.context';

  interface Props {
    zIndex?: number;
  }

  const props = withDefaults(defineProps<Props>(), { zIndex: 100001 });

  defineOptions({ name: 'ModalLayoutFullscreen', inheritAttrs: false });

  const slots = useSlots();
  const { title, closable, showCloseButton, classes, requestClose } = useModalContext();

  const hasHeader = computed(() => Boolean(slots['header'] || title.value));
  const hasFooter = computed(() => Boolean(slots['footer']));
  const showClose = computed(() => closable.value && showCloseButton.value);

  /* @unocss-skip-start */
  const wrapperStyles = computed(() => ({ zIndex: props.zIndex }));
  /* @unocss-skip-end */
</script>

<template>
  <Transition
    name="noirium-modal-fullscreen"
    appear
  >
    <div
      data-noirium-modal-root
      role="dialog"
      aria-modal="true"
      :class="[':uno: fixed inset-0 flex flex-col bg-white dark:bg-zinc-700', classes.wrapper]"
      :style="wrapperStyles"
    >
      <div
        v-if="hasHeader"
        data-noirium-modal-header
        :class="[
          ':uno: flex shrink-0 items-start justify-between bg-white px-6 pt-5 pb-4 dark:bg-zinc-700',
          classes.header,
        ]"
      >
        <div class=":uno: flex-1">
          <slot name="header">
            <h3 class=":uno: text-text-darker m-0 text-xl font-semibold dark:text-white">
              {{ title }}
            </h3>
          </slot>
        </div>
      </div>

      <button
        v-if="showClose"
        type="button"
        data-noirium-modal-close
        :class="[
          ':uno: absolute top-6 right-6 cursor-pointer border-none bg-transparent p-0',
          classes.closeButton,
        ]"
        @click="requestClose"
      >
        <slot name="close-icon">
          <span class=":uno: i-ui-icon-close size-4 text-gray-500 dark:text-gray-200" />
        </slot>
      </button>

      <div
        data-noirium-modal-content
        :class="[
          ':uno: min-h-0 flex-1 overflow-y-auto bg-white px-6 py-5 dark:bg-zinc-700',
          classes.content,
        ]"
      >
        <slot name="content">
          <slot />
        </slot>
      </div>

      <div
        v-if="hasFooter"
        :class="[':uno: shrink-0 bg-white px-6 pt-4 pb-5 dark:bg-zinc-700', classes.footer]"
      >
        <slot name="footer" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-modal-fullscreen-enter-active,
  .noirium-modal-fullscreen-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
  .noirium-modal-fullscreen-enter-from,
  .noirium-modal-fullscreen-leave-to {
    opacity: 0;
    transform: translateY(2%);
  }
  /* @unocss-skip-end */
</style>
