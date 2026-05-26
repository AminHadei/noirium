<script setup lang="ts" generic="T extends BaseDropdownItem">
  import { onClickOutside, useEventListener } from '@vueuse/core';
  import { ref, computed, nextTick, watch } from 'vue';

  import type { BaseDropdownItem, BaseDropdownProps } from './types';

  const props = withDefaults(defineProps<BaseDropdownProps<T>>(), {
    closeOnSelect: true,
    placement: 'bottom',
    offset: 8,
    minWidth: '200px',
    maxHeight: '300px',
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: T | null): void;
    (e: 'open'): void;
    (e: 'close'): void;
  }>();

  const isOpen = ref(false);
  const rootRef = ref<HTMLElement | null>(null);
  const dropdownRef = ref<HTMLElement | null>(null);
  const focusedIndex = ref(-1);

  const selectedId = computed(() => props.modelValue?.id);

  function scrollToFocusedItem(): void {
    nextTick(() => {
      const focusedElement = dropdownRef.value?.querySelector(
        `[data-index="${focusedIndex.value}"]`,
      );
      if (focusedElement && typeof focusedElement.scrollIntoView === 'function') {
        // @unocss-skip-start
        focusedElement.scrollIntoView({ block: 'nearest' });
        // @unocss-skip-end
      }
    });
  }

  function focusNext(): void {
    let nextIndex = focusedIndex.value + 1;
    while (nextIndex < props.items.length) {
      const item = props.items[nextIndex];
      if (item && !item.disabled) {
        focusedIndex.value = nextIndex;
        scrollToFocusedItem();
        return;
      }
      nextIndex += 1;
    }
  }

  function focusPrevious(): void {
    let prevIndex = focusedIndex.value - 1;
    while (prevIndex >= 0) {
      const item = props.items[prevIndex];
      if (item && !item.disabled) {
        focusedIndex.value = prevIndex;
        scrollToFocusedItem();
        return;
      }
      prevIndex -= 1;
    }
  }

  function focusFirst(): void {
    const firstEnabled = props.items.findIndex((item) => !item.disabled);
    if (firstEnabled >= 0) {
      focusedIndex.value = firstEnabled;
      scrollToFocusedItem();
    }
  }

  function focusLast(): void {
    for (let i = props.items.length - 1; i >= 0; i -= 1) {
      const item = props.items[i];
      if (item && !item.disabled) {
        focusedIndex.value = i;
        scrollToFocusedItem();
        return;
      }
    }
  }

  function open(): void {
    isOpen.value = true;
    emit('open');
  }

  function close(): void {
    isOpen.value = false;
    emit('close');
  }

  function select(item: T): void {
    if (item.disabled) return;
    emit('update:modelValue', item);
    if (props.closeOnSelect) close();
  }

  // Click outside handler
  onClickOutside(rootRef, (): void => {
    if (isOpen.value) close();
  });

  // Keyboard navigation
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (!isOpen.value) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNext();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPrevious();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex.value >= 0) {
          const item = props.items[focusedIndex.value];
          if (item && !item.disabled) {
            select(item as T);
          }
        }
        break;
      case 'Home':
        event.preventDefault();
        focusFirst();
        break;
      case 'End':
        event.preventDefault();
        focusLast();
        break;
      default:
        break;
    }
  });

  // Watch isOpen to reset focused index
  watch(isOpen, (value) => {
    if (value) {
      // Set initial focus to selected item or first item
      const selectedIndex = props.items.findIndex((item) => item.id === selectedId.value);
      focusedIndex.value = Math.max(selectedIndex, 0);

      // Focus the dropdown for keyboard navigation
      nextTick(() => {
        dropdownRef.value?.focus();
      });
    } else {
      focusedIndex.value = -1;
    }
  });

  function toggle(): void {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }

  defineExpose({
    close,
    open,
    toggle,
    isOpen,
    selectedId,
    focusedIndex,
  });
</script>

<template>
  <div
    ref="rootRef"
    class=":uno: relative inline-block"
  >
    <!-- TRIGGER -->
    <div
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <slot
        :is-open="isOpen"
        :selected-item="modelValue"
      />
    </div>

    <!-- DROPDOWN -->
    <Transition
      name="dropdown"
      @after-leave="focusedIndex = -1"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        tabindex="-1"
        role="datalist"
        :aria-activedescendant="focusedIndex >= 0 ? `option-${items[focusedIndex]?.id}` : undefined"
        class=":uno: absolute z-50 min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none"
        :class="{
          ':uno: top-full': placement === 'bottom',
          ':uno: bottom-full': placement === 'top',
        }"
        :style="{
          [placement === 'bottom' ? 'marginTop' : 'marginBottom']: `${offset}px`,
          minWidth: minWidth,
          maxHeight: maxHeight,
        }"
      >
        <ul class=":uno: py-1">
          <li
            v-for="(item, index) in items"
            :id="`option-${item.id}`"
            :key="item.id"
            :data-index="index"
            role="option"
            :aria-selected="item.id === selectedId"
            :aria-disabled="item.disabled"
            class=":uno: cursor-pointer px-4 py-2.5 text-sm transition-colors"
            :class="{
              ':uno: text-primary bg-surface font-semibold': item.id === selectedId,
              ':uno: text-gray-900': item.id !== selectedId && !item.disabled,
              ':uno: hover:bg-gray-100': !item.disabled && item.id !== selectedId,
              ':uno: ring-2 ring-primary ring-inset': focusedIndex === index && !item.disabled,
              ':uno: cursor-not-allowed opacity-50': item.disabled,
            }"
            @click="select(item as T)"
            @mouseenter="focusedIndex = index"
          >
            <slot
              name="item"
              :item="item"
              :is-selected="item.id === selectedId"
              :is-focused="focusedIndex === index"
              :is-disabled="item.disabled"
            >
              {{ item.label }}
            </slot>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  /* @unocss-skip-start */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .dropdown-enter-to,
  .dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  /* @unocss-skip-end */
</style>
