<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue';

  defineOptions({
    name: 'NoiriumCommandDisplay',
  });

  const { command } = defineProps<{
    command: string;
  }>();

  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const palette = [':uno: text-text-light', ':uno: text-text-dark', ':uno: text-primary'];

  const parts = computed(() =>
    command.split(' ').map((text, index) => ({
      text,
      color: palette[index % palette.length] ?? palette[0],
    })),
  );

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(command);
      copied.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch {
      copied.value = false;
    }
  };

  onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div
    data-slot="command-display"
    class=":uno: group bg-primary relative flex items-center rounded-lg py-2 pl-4 font-mono text-xs text-white"
  >
    <div class=":uno: flex-1 overflow-hidden whitespace-nowrap">
      <div class=":uno: overflow-hidden text-ellipsis">
        <span
          v-for="(part, index) in parts"
          :key="index"
          :class="part.color"
        >
          {{ part.text }}<template v-if="index < parts.length - 1">&nbsp;</template>
        </span>
      </div>
    </div>
    <button
      type="button"
      aria-label="Copy command"
      class=":uno: text-text-light mr-2 inline-flex size-8 shrink-0 items-center justify-center transition-colors hover:text-white"
      @click="copy"
    >
      <span
        class=":uno: size-4"
        :class="copied ? ':uno: i-check text-white' : ':uno: i-clipboard'"
      />
    </button>
  </div>
</template>
