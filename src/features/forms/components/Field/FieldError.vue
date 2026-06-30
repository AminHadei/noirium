<script setup lang="ts">
  defineOptions({
    name: 'NoiriumFieldError',
  });
</script>

<template>
  <p
    data-slot="field-error"
    role="alert"
    class=":uno: text-status-red-strong text-left text-sm leading-normal font-normal"
  >
    <slot />
  </p>
</template>
