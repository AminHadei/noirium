<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumbItem',
  });
</script>

<template>
  <li
    data-slot="breadcrumb-item"
    class=":uno: inline-flex items-center"
  >
    <slot />
  </li>
</template>
