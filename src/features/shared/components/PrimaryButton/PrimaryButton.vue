<script lang="ts" setup>
  import { computed, useAttrs } from 'vue';

  const {
    to = '',
    href = '',
    loading = false,
    disabled = false,
    showChevron = true,
    variant = 'primary',
  } = defineProps<{
    to?: string | Record<string, unknown>;
    href?: string;
    loading?: boolean;
    disabled?: boolean;
    showChevron?: boolean;
    variant?: 'primary' | 'outline' | 'text';
  }>();

  const emit = defineEmits<{
    click: [event: Event];
  }>();

  const attrs = useAttrs();

  const componentType = computed(() => {
    if (to) return 'nuxt-link';
    if (href) return 'a';
    return 'button';
  });

  const buttonClasses = computed(() => {
    const base = [
      ':uno: select-none inline-flex items-center justify-center rounded-full font-medium font-noto transition-colors duration-200 py-1.5 px-4 cursor-pointer text-base focus-visible:outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-text-light',
    ];

    const variants = {
      primary: [
        ':uno: border-none bg-primary text-white hover:bg-text-darker hover:text-white active:bg-text-darker',
      ],
      outline: [
        ':uno: bg-transparent border-1 border-primary text-primary hover:bg-transparent hover:text-text-darker hover:border-text-darker active:bg-transparent active:text-text-darker active:border-text-darker',
      ],
      text: [
        ':uno: border-none bg-transparent text-primary hover:text-text-darker active:text-text-darker',
      ],
    };

    const disabledVariant = {
      primary: [':uno: bg-primary/30', ':uno: text-white/60'],
      outline: [':uno: border-primary/30', ':uno: text-primary/30'],
      text: [':uno: text-primary/30'],
    };

    const classes = [...base];

    if (disabled || loading) {
      classes.push(...disabledVariant[variant], ':uno: pointer-events-none');
    } else {
      classes.push(...variants[variant]);
    }

    return classes;
  });

  const handleClick = (event: Event): void => {
    // Only prevent default for buttons, not for links
    if (componentType.value === 'button') {
      event.preventDefault();
    }

    if (disabled || loading) return;
    emit('click', event);
  };
</script>

<template>
  <component
    :is="componentType"
    :class="[
      buttonClasses,
      {
        ':uno: pointer-events-none': disabled || loading,
        ':uno: pr-[10px] pl-4': showChevron && !loading,
      },
    ]"
    :disabled="disabled"
    :href="href"
    :rel="href ? 'noopener noreferrer' : undefined"
    :to="to"
    class=":uno: group h-9"
    v-bind="attrs"
    @click="handleClick"
  >
    <span class=":uno: flex items-center">
      <slot />
      <span
        v-if="loading || showChevron"
        class=":uno: ml-1 size-5 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-0 group-active:translate-x-0"
      >
        <span
          v-if="loading"
          class=":uno: loader ml-1"
          data-primary-button-loader
        />
        <span
          v-else
          class=":uno: i-chevron size-5"
          data-primary-button-chevron
        />
      </span>
    </span>
  </component>
</template>

<style scoped>
  /* @unocss-skip-start */
  .loader {
    width: 20px;
    height: 20px;
    border-bottom-color: transparent !important;
    border-radius: 50%;
    display: inline-block;
    border: 3px solid currentColor;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  /* @unocss-skip-end */
</style>
