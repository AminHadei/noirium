<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumbSeparator',
  });
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    class=":uno: text-text-light"
  >
    <slot>
      <span class=":uno: i-chevron-right block size-4" />
    </slot>
  </li>
</template>
