<script setup lang="ts">
  import { computed } from 'vue';

  defineOptions({
    name: 'NoiriumProgress',
  });

  const { value = 0, max = 100 } = defineProps<{
    value?: number;
    max?: number;
  }>();

  const percent = computed(() => {
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (value / max) * 100));
  });
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    class=":uno: border-border bg-surface relative h-2 w-full overflow-hidden rounded-full border-1"
  >
    <div
      class=":uno: bg-primary h-full rounded-full transition-all"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>
