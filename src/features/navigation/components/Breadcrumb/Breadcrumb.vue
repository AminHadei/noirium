<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumb',
  });
</script>

<template>
  <nav
    aria-label="breadcrumb"
    data-slot="breadcrumb"
    class=":uno: font-noto w-full text-sm"
  >
    <slot />
  </nav>
</template>
