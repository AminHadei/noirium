<script setup lang="ts">
  defineOptions({
    name: 'NoiriumInput',
  });

  const { invalid = false } = defineProps<{
    invalid?: boolean;
  }>();

  const model = defineModel<string | number>();
</script>

<template>
  <input
    v-model="model"
    :aria-invalid="invalid || undefined"
    class=":uno: form-main-input w-full rounded-lg px-5 py-2"
    :class="invalid ? ':uno: border-status-red focus-within:ring-status-red/20' : ''"
  />
</template>
