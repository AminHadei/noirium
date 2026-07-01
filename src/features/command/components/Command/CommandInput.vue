<script setup lang="ts">
  import { inject } from 'vue';

  import { commandContextKey } from './command.context';

  defineOptions({
    name: 'NoiriumCommandInput',
    inheritAttrs: false,
  });

  const { placeholder = 'Type a command or search...' } = defineProps<{
    placeholder?: string;
  }>();

  const context = inject(commandContextKey);

  const onInput = (event: Event): void => {
    context?.setSearch((event.target as HTMLInputElement).value);
  };
</script>

<template>
  <div
    data-slot="command-input"
    class=":uno: border-border flex items-center border-b px-4"
  >
    <span class=":uno: i-search text-text-light me-2 size-4 shrink-0" />
    <input
      :value="context?.search.value"
      :placeholder="placeholder"
      data-slot="command-input-field"
      class=":uno: text-text-dark placeholder:text-text-light flex h-10 w-full rounded bg-transparent py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
      v-bind="$attrs"
      @input="onInput"
    />
  </div>
</template>
