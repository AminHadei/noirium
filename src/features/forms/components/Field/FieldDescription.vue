<script setup lang="ts">
  defineOptions({
    name: 'NoiriumFieldDescription',
  });
</script>

<template>
  <p
    data-slot="field-description"
    class=":uno: text-text-muted text-left text-sm leading-normal font-normal"
  >
    <slot />
  </p>
</template>
