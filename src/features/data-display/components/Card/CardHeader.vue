<script setup lang="ts">
  defineOptions({
    name: 'NoiriumCardHeader',
  });
</script>

<template>
  <div
    data-slot="card-header"
    class=":uno: flex flex-col justify-start p-4"
  >
    <slot />
  </div>
</template>
