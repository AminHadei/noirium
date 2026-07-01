<script setup lang="ts">
  import { type ComponentPublicInstance, inject } from 'vue';

  import { carouselContextKey } from './carousel.context';

  defineOptions({
    name: 'NoiriumCarouselContent',
  });

  const context = inject(carouselContextKey);
  const orientation = context?.orientation ?? 'horizontal';

  const setRef = (el: Element | ComponentPublicInstance | null): void => {
    if (context !== undefined) {
      context.carouselRef.value = (el as HTMLElement | null) ?? undefined;
    }
  };
</script>

<template>
  <div
    :ref="setRef"
    data-slot="carousel-content"
    class=":uno: overflow-hidden"
  >
    <div
      class=":uno: flex"
      :class="orientation === 'horizontal' ? ':uno: -ml-4' : ':uno: -mt-4 flex-col'"
    >
      <slot />
    </div>
  </div>
</template>
