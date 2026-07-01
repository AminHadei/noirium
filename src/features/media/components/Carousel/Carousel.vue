<script setup lang="ts">
  import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
  import emblaCarouselVue from 'embla-carousel-vue';
  import { onBeforeUnmount, provide, ref, watch } from 'vue';

  import { carouselContextKey, type CarouselOrientation } from './carousel.context';

  defineOptions({
    name: 'NoiriumCarousel',
  });

  const { orientation = 'horizontal', opts } = defineProps<{
    orientation?: CarouselOrientation;
    opts?: EmblaOptionsType;
  }>();

  const emit = defineEmits<{
    init: [api: EmblaCarouselType];
  }>();

  const [carouselRef, api] = emblaCarouselVue({
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  });

  const canScrollPrev = ref(false);
  const canScrollNext = ref(false);

  const onSelect = (): void => {
    const instance = api.value;
    if (instance === undefined) return;
    canScrollPrev.value = instance.canScrollPrev();
    canScrollNext.value = instance.canScrollNext();
  };

  const scrollPrev = (): void => {
    api.value?.scrollPrev();
  };

  const scrollNext = (): void => {
    api.value?.scrollNext();
  };

  watch(api, (instance) => {
    if (instance === undefined) return;
    onSelect();
    instance.on('reInit', onSelect);
    instance.on('select', onSelect);
    emit('init', instance);
  });

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    }
  };

  onBeforeUnmount(() => api.value?.off('select', onSelect));

  provide(carouselContextKey, {
    carouselRef,
    api,
    orientation,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  });
</script>

<template>
  <div
    role="region"
    aria-roledescription="carousel"
    data-slot="carousel"
    tabindex="0"
    class=":uno: focus-visible:outline-text-light relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-none"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
