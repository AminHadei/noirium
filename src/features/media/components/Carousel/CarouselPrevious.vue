<script setup lang="ts">
  import { inject } from 'vue';

  import { IconButton } from '@/features/buttons';

  import { carouselContextKey } from './carousel.context';

  defineOptions({
    name: 'NoiriumCarouselPrevious',
  });

  const context = inject(carouselContextKey);
  const orientation = context?.orientation ?? 'horizontal';
</script>

<template>
  <IconButton
    variant="outline"
    size="sm"
    data-slot="carousel-previous"
    :disabled="!(context?.canScrollPrev.value ?? false)"
    class=":uno: absolute"
    :class="
      orientation === 'horizontal'
        ? ':uno: top-1/2 -left-12 -translate-y-1/2'
        : ':uno: -top-12 left-1/2 -translate-x-1/2 rotate-90'
    "
    @click="context?.scrollPrev()"
  >
    <span class=":uno: i-arrow-left size-4" />
    <span class=":uno: sr-only">Previous slide</span>
  </IconButton>
</template>
