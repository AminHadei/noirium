<script setup lang="ts">
  import { useModalContext } from 'noirium/ui';

  defineOptions({ name: 'BrandedHeroLayout', inheritAttrs: false });

  const { title, requestClose } = useModalContext();

  const onBackdropClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) requestClose();
  };
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 flex items-center justify-center p-6"
    style="z-index: 100001"
    @click="onBackdropClick"
  >
    <div
      class="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-600 text-white shadow-2xl"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20"
      />

      <div class="relative p-8">
        <div
          class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl"
        >
          🎉
        </div>

        <h2 class="m-0 text-2xl font-bold">{{ title ?? 'Welcome' }}</h2>

        <div class="mt-3 text-white/90">
          <slot />
        </div>

        <div class="mt-6 flex gap-3">
          <button
            type="button"
            class="rounded-lg bg-white/20 px-4 py-2 transition hover:bg-white/30"
            @click="requestClose"
          >
            Maybe later
          </button>
          <button
            type="button"
            class="rounded-lg bg-white px-4 py-2 font-semibold text-neutral-900 transition hover:bg-white/90"
            @click="requestClose"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
