<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCommandCheck',
  });
</script>

<template>
  <span
    data-slot="command-check"
    data-check="true"
    class=":uno: text-primary [margin-inline-start:auto] size-4"
  >
    <span class=":uno: i-check size-4" />
  </span>
</template>
