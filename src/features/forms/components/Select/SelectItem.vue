<script setup lang="ts">
  import { computed, inject, onMounted, useTemplateRef } from 'vue';

  import { selectContextKey } from './select.context';

  defineOptions({
    name: 'NoiriumSelectItem',
  });

  const { value, disabled = false } = defineProps<{
    value: string;
    disabled?: boolean;
  }>();

  const context = inject(selectContextKey);
  const el = useTemplateRef<HTMLElement>('el');

  const selected = computed(() => context?.modelValue.value === value);

  onMounted(() => {
    context?.registerLabel(value, el.value?.textContent?.trim() ?? value);
  });
</script>

<template>
  <div
    ref="el"
    role="option"
    data-slot="select-item"
    :aria-selected="selected"
    :data-disabled="disabled ? '' : undefined"
    class=":uno: hover:bg-primary relative flex w-full cursor-default items-center py-1.5 pr-8 pl-2 outline-none select-none hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @click="!disabled && context?.select(value)"
  >
    <span class=":uno: flex flex-1 shrink-0">
      <slot />
    </span>
    <span
      v-if="selected"
      class=":uno: i-check absolute right-2 size-4"
    />
  </div>
</template>
