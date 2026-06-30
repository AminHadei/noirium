<script setup lang="ts">
  defineOptions({
    name: 'NoiriumTextarea',
  });

  const { invalid = false } = defineProps<{
    invalid?: boolean;
  }>();

  const model = defineModel<string>();
</script>

<template>
  <textarea
    v-model="model"
    rows="4"
    :aria-invalid="invalid || undefined"
    class=":uno: form-main-input w-full resize-y rounded-lg px-5 py-2"
    :class="invalid ? ':uno: border-status-red focus-within:ring-status-red/20' : ''"
  />
</template>
