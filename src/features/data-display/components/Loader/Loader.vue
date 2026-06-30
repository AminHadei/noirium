<script setup lang="ts">
  import { computed } from 'vue';

  import { MILLIS_SUFFIX } from '@/features/shared/composables/scan-safe.util';

  import type { LoaderSize, LoaderVariant } from './loader.types';

  defineOptions({
    name: 'NoiriumLoader',
  });

  const {
    variant = 'default',
    size = 'md',
    count = 3,
    duration = 0.5,
    delayStep = 100,
  } = defineProps<{
    variant?: LoaderVariant;
    size?: LoaderSize;
    count?: number;
    duration?: number;
    delayStep?: number;
  }>();

  const loaderClass = computed(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: ':uno: [&>div]:size-1.5',
      md: ':uno: [&>div]:size-2',
      lg: ':uno: [&>div]:size-2.5',
    };

    const variants: Record<LoaderVariant, string> = {
      default: ':uno: [&>div]:bg-primary',
      secondary: ':uno: [&>div]:bg-text-light',
      outline: ':uno: [&>div]:bg-transparent [&>div]:border-1 [&>div]:border-border',
    };

    return `:uno: flex gap-1 ${sizes[size]} ${variants[variant]}`;
  });

  const dots = computed(() => Array.from({ length: Math.max(0, count) }, (_, index) => index));

  const dotStyle = (index: number): Record<string, string> => ({
    animationDuration: `${duration}s`,
    animationIterationCount: 'infinite',
    animationDelay: `${index * delayStep}${MILLIS_SUFFIX}`,
  });
</script>

<template>
  <div
    :class="loaderClass"
    role="status"
    aria-label="Loading..."
  >
    <div
      v-for="index in dots"
      :key="index"
      class=":uno: animate-bounce rounded-full"
      :style="dotStyle(index)"
    />
  </div>
</template>
