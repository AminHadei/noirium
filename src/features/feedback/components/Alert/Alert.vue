<script setup lang="ts">
  import { computed } from 'vue';

  import type { AlertStatus, AlertVariant } from './alert.types';

  defineOptions({
    name: 'NoiriumAlert',
  });

  const { variant = 'default', status } = defineProps<{
    variant?: AlertVariant;
    status?: AlertStatus;
  }>();

  const alertClass = computed(() => {
    const base = ':uno: relative w-full rounded-lg border-1 p-4';

    if (status) {
      const statusMap: Record<AlertStatus, string> = {
        error: ':uno: border-status-red bg-status-badge-red-bg text-status-badge-red-text',
        success: ':uno: border-status-green bg-status-badge-green-bg text-status-badge-green-text',
        warning: ':uno: border-status-yellow bg-[#FEF3C7] text-[#92400E]',
        info: ':uno: border-status-blue bg-surface-muted text-text-darker',
      };
      return [base, statusMap[status]];
    }

    if (variant === 'solid') {
      return [base, ':uno: border-primary bg-primary text-white'];
    }

    return [base, ':uno: border-border bg-surface-muted text-text-dark'];
  });
</script>

<template>
  <div
    role="alert"
    data-slot="alert"
    :class="alertClass"
  >
    <slot />
  </div>
</template>
