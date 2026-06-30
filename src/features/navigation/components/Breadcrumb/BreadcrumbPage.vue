<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumbPage',
  });
</script>

<template>
  <span
    data-slot="breadcrumb-page"
    aria-current="page"
    class=":uno: font-figtree text-text-darker font-semibold"
  >
    <slot />
  </span>
</template>
