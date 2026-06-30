<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumbEllipsis',
  });
</script>

<template>
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    class=":uno: flex size-9 items-center justify-center"
  >
    &#8230;
    <span class=":uno: sr-only">More</span>
  </span>
</template>
