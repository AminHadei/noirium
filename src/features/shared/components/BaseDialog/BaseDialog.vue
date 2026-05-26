<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, watch, useAttrs } from 'vue';

  import { useDialogStack } from '@/features/shared/composables/useDialogStack';
  import { useTeleportTarget } from '@/features/shared/composables/useTeleportTarget';

  export interface BaseDialogProps {
    visible?: boolean;
    header?: string | null;
    closable?: boolean;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    width?: string;
    maxWidth?: string;
    modal?: boolean;
    contentClass?: string | null;
    overlayClass?: string | null;
    teleportTo?: string;
  }

  const props = withDefaults(defineProps<BaseDialogProps>(), {
    visible: false,
    header: null,
    closable: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    width: '500px',
    maxWidth: '90vw',
    modal: true,
    contentClass: null,
    overlayClass: null,
    teleportTo: 'body',
  });

  const emit = defineEmits<{
    'update:visible': [value: boolean];
    open: [];
    close: [];
  }>();

  defineOptions({ name: 'BaseDialog', inheritAttrs: false });
  const attrs = useAttrs();

  const isOpen = ref(props.visible);
  const actualTeleportTarget = useTeleportTarget(props.teleportTo);

  const dialogId = Symbol('base-dialog');
  const { register, unregister, isTopmost, index } = useDialogStack(dialogId);

  const Z_BASE = 100000;
  const Z_STEP = 10;
  const overlayZIndex = computed(() => Z_BASE + Math.max(0, index.value) * Z_STEP);
  const dialogZIndex = computed(() => overlayZIndex.value + 1);

  /* @unocss-skip-start */
  const dialogStyles = computed(() => ({
    width: props.width,
    maxWidth: props.maxWidth,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: dialogZIndex.value,
  }));
  /* @unocss-skip-end */

  const overlayStyles = computed(() => ({ zIndex: overlayZIndex.value }));

  const overlayClasses = computed(() => {
    const base = ':uno: fixed inset-0 bg-gray-500/75 backdrop-blur-sm';
    return [base, props.overlayClass].filter(Boolean);
  });

  const open = (): void => {
    isOpen.value = true;
    emit('update:visible', true);
    emit('open');
  };

  const close = (): void => {
    if (!props.closable) return;
    isOpen.value = false;
    emit('update:visible', false);
    emit('close');
  };

  const toggle = (): void => {
    if (isOpen.value) close();
    else open();
  };

  const handleOverlayClick = (): void => {
    if (props.closeOnClickOutside && props.closable) close();
  };

  const handleEscapeKey = (event: KeyboardEvent): void => {
    if (
      event.key === 'Escape' &&
      isOpen.value &&
      isTopmost.value &&
      props.closeOnEscape &&
      props.closable
    ) {
      event.stopPropagation();
      close();
    }
  };

  watch(
    () => props.visible,
    (newValue) => {
      isOpen.value = newValue;
    },
  );

  watch(
    isOpen,
    (val) => {
      if (val) register();
      else unregister();
    },
    { immediate: true },
  );

  onMounted(() => {
    document.addEventListener('keydown', handleEscapeKey);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscapeKey);
    unregister();
  });

  defineExpose({ open, close, toggle });
</script>

<template>
  <Teleport :to="actualTeleportTarget">
    <Transition
      name="overlay"
      appear
    >
      <div
        v-if="isOpen && modal"
        :class="overlayClasses"
        :style="overlayStyles"
        @click="handleOverlayClick"
      />
    </Transition>

    <Transition
      name="dialog"
      appear
    >
      <div
        v-if="isOpen"
        role="dialog"
        aria-modal="true"
        class=":uno: fixed"
        :style="dialogStyles"
      >
        <div
          :class="[
            ':uno: max-h-90vh flex flex-col overflow-hidden rounded-[20px] bg-white',
            contentClass,
          ]"
          v-bind="attrs"
          @click.stop
        >
          <template
            v-if="$slots['header'] || $slots['content'] || $slots['footer'] || header || closable"
          >
            <!-- Header -->
            <div
              v-if="$slots['header'] || header"
              class=":uno: flex shrink-0 items-start justify-between px-6 pt-5 pb-4"
            >
              <div class=":uno: flex-1">
                <slot name="header">
                  <h3 class=":uno: text-text-darker m-0 text-xl font-semibold">
                    {{ header }}
                  </h3>
                </slot>
              </div>
            </div>

            <button
              v-if="closable"
              type="button"
              class=":uno: absolute top-6 right-6 cursor-pointer border-none bg-transparent p-0"
              @click="close"
            >
              <span class=":uno: i-close text-text-dark size-6" />
            </button>

            <!-- Content -->
            <div class=":uno: min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <slot name="content">
                <slot />
              </slot>
            </div>

            <!-- Footer -->
            <div
              v-if="$slots['footer']"
              class=":uno: shrink-0 px-6 pt-4 pb-5"
            >
              <slot name="footer" />
            </div>
          </template>
          <template v-else>
            <div class=":uno: overflow-y-auto px-6 py-5">
              <slot />
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  /* @unocss-skip-start */
  .dialog-enter-active,
  .dialog-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dialog-enter-from,
  .dialog-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }

  .dialog-enter-to,
  .dialog-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 0.3s ease;
  }

  .overlay-enter-from,
  .overlay-leave-to {
    opacity: 0;
  }

  .overlay-enter-to,
  .overlay-leave-from {
    opacity: 1;
  }
  /* @unocss-skip-end */
</style>
