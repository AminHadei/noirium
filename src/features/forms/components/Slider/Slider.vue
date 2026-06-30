<script setup lang="ts">
  import { computed } from 'vue';

  defineOptions({
    name: 'NoiriumSlider',
  });

  const {
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
  } = defineProps<{
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
  }>();

  const model = defineModel<number>({ default: 0 });

  const fillPercent = computed(() => {
    const range = max - min || 1;
    const clamped = Math.min(Math.max(Number(model.value), min), max);
    return `${((clamped - min) / range) * 100}%`;
  });
</script>

<template>
  <input
    v-model.number="model"
    type="range"
    class=":uno: noirium-slider w-full"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :style="{ '--noirium-slider-fill': fillPercent }"
  />
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-slider {
    appearance: none;
    -webkit-appearance: none;
    height: 0.5rem;
    cursor: pointer;
    border-radius: 9999px;
    border: 1px solid var(--un-border-border, #e5e5e5);
    background-color: var(--un-surface, #f5f5f5);
    background-image: linear-gradient(#171717, #171717);
    background-repeat: no-repeat;
    background-size: var(--noirium-slider-fill, 0%) 100%;
  }

  .noirium-slider:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .noirium-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1rem;
    width: 1rem;
    border-radius: 9999px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
  }

  .noirium-slider::-moz-range-thumb {
    height: 1rem;
    width: 1rem;
    border-radius: 9999px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
  }
  /* @unocss-skip-end */
</style>
