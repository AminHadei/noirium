<script lang="ts" setup>
  import { computed, useSlots } from 'vue';

  import { useModalContext } from '@/features/shared/components/Modal/Modal.context';

  interface Props {
    zIndex?: number;
  }

  const props = withDefaults(defineProps<Props>(), { zIndex: 100001 });

  defineOptions({ name: 'ModalLayoutDefault', inheritAttrs: false });

  const slots = useSlots();
  const { title, closable, showCloseButton, isBottomSheet, classes, requestClose } =
    useModalContext();

  const hasHeader = computed(() => Boolean(slots['header'] || title.value));
  const hasFooter = computed(() => Boolean(slots['footer']));
  const showClose = computed(() => closable.value && showCloseButton.value);

  /* @unocss-skip-start */
  const wrapperStyles = computed(() => ({ zIndex: props.zIndex }));
  /* @unocss-skip-end */

  const wrapperBaseClasses = computed(() => {
    if (isBottomSheet.value) {
      return ':uno: fixed inset-0 flex flex-col justify-end pointer-events-none';
    }
    return ':uno: fixed inset-0 flex items-center justify-center p-4 pointer-events-none';
  });

  const wrapperClasses = computed(() => [wrapperBaseClasses.value, classes.value.wrapper]);

  const bodyBaseClasses = computed(() => {
    if (isBottomSheet.value) {
      return ':uno: pointer-events-auto relative flex flex-col w-full max-h-[85vh] rounded-t-2xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)] dark:bg-zinc-700';
    }
    return ':uno: pointer-events-auto relative flex flex-col w-full max-w-md max-h-[90vh] rounded-[20px] bg-white shadow-2xl dark:bg-zinc-700';
  });

  const transitionName = computed(() =>
    isBottomSheet.value ? 'noirium-modal-sheet' : 'noirium-modal-fade',
  );
</script>

<template>
  <Transition
    :name="transitionName"
    appear
  >
    <div
      data-noirium-modal-root
      role="dialog"
      aria-modal="true"
      :class="wrapperClasses"
      :style="wrapperStyles"
      @click.self="requestClose"
    >
      <div
        data-noirium-modal-body
        :class="[bodyBaseClasses, classes.body]"
        @click.stop
      >
        <span
          v-if="isBottomSheet"
          data-noirium-modal-handle
          aria-hidden="true"
          class=":uno: mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-500"
        />

        <div
          v-if="hasHeader"
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
    </div>
  </Transition>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-modal-fade-enter-active,
  .noirium-modal-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .noirium-modal-fade-enter-from,
  .noirium-modal-fade-leave-to {
    opacity: 0;
  }
  .noirium-modal-fade-enter-from > *,
  .noirium-modal-fade-leave-to > * {
    transform: scale(0.96);
  }

  .noirium-modal-sheet-enter-active,
  .noirium-modal-sheet-leave-active {
    transition: opacity 0.25s ease;
  }
  .noirium-modal-sheet-enter-active > [data-noirium-modal-body],
  .noirium-modal-sheet-leave-active > [data-noirium-modal-body] {
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .noirium-modal-sheet-enter-from,
  .noirium-modal-sheet-leave-to {
    opacity: 0;
  }
  .noirium-modal-sheet-enter-from > [data-noirium-modal-body],
  .noirium-modal-sheet-leave-to > [data-noirium-modal-body] {
    transform: translateY(100%);
  }
  /* @unocss-skip-end */
</style>
