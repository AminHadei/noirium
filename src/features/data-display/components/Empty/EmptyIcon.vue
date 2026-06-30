<script setup lang="ts">
  defineOptions({
    name: 'NoiriumEmptyIcon',
  });
</script>

<template>
  <div
    data-slot="empty-icon"
    class=":uno: text-text-light"
  >
    <slot>
      <span class=":uno: i-search block size-10 opacity-40" />
    </slot>
  </div>
</template>
