<script setup lang="ts">
  defineOptions({
    name: 'NoiriumBreadcrumbLink',
  });

  const { href = '' } = defineProps<{
    href?: string;
  }>();
</script>

<template>
  <a
    data-slot="breadcrumb-link"
    :href="href === '' ? undefined : href"
    class=":uno: font-noto text-text-dark hover:text-text-darker focus-visible:outline-text-light rounded-sm font-medium transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed"
  >
    <slot />
  </a>
</template>
