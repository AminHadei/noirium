<script setup lang="ts">
  import { ref, computed } from 'vue';

  import fallbackImageSvg from '@/assets/images/default-profile.png';
  import { config } from '@/config';

  export interface AvatarProps {
    src?: string | null;
    alt?: string;
    width?: number;
    height?: number;
  }

  defineOptions({
    name: 'BaseAvatar',
  });

  const props = withDefaults(defineProps<AvatarProps>(), {
    src: null,
    alt: '',
    width: undefined,
    height: undefined,
  });

  const imageError = ref(false);
  const imageSrc = computed(() => {
    if (!props.src || imageError.value) {
      return fallbackImageSvg;
    }
    return props.src;
  });

  const imageTag = computed(() => config.get('imageComponent'));

  const handleImageError = (): void => {
    imageError.value = true;
  };
</script>

<template>
  <component
    :is="imageTag"
    :src="imageSrc"
    :alt="alt || 'Avatar'"
    :width="width"
    :height="height"
    @error="handleImageError"
  />
</template>
