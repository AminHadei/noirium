<script setup lang="ts">
  import { PrimaryButton } from '@/features/shared';

  import { createToastHelpers, useToast } from '../../lib/composables/use-toast';

  const props = withDefaults(
    defineProps<{
      variant?: 'actions' | 'stacking';
    }>(),
    {
      variant: 'actions',
    },
  );

  const toast = useToast();
  const helpers = createToastHelpers(toast);

  const showInfo = (): void => {
    helpers.info({
      title: 'Info Toast',
      description: 'This is an informational message.',
    });
  };

  const showError = (): void => {
    helpers.error({
      title: 'Error Toast',
      description: 'Something went wrong.',
    });
  };

  const showSuccess = (): void => {
    helpers.success({
      title: 'Success Toast',
      description: 'Operation completed successfully.',
    });
  };

  const showWarning = (): void => {
    helpers.warning({
      title: 'Warning Toast',
      description: 'Please review before proceeding.',
    });
  };

  const showWithoutTitle = (): void => {
    helpers.info({
      description: 'This toast has no title.',
    });
  };

  const showPersistent = (): void => {
    helpers.info({
      title: 'Persistent Toast',
      description: 'This toast will not auto-close.',
      duration: 0,
    });
  };

  const showCustomDuration = (): void => {
    helpers.success({
      title: 'Short Duration',
      description: 'This toast will close in 2 seconds.',
      duration: 2000,
    });
  };

  const clearAll = (): void => {
    helpers.clearAll();
  };

  const addMultipleToasts = (): void => {
    helpers.info({
      title: 'Toast 1',
      description: 'First toast',
    });
    setTimeout((): void => {
      helpers.success({
        title: 'Toast 2',
        description: 'Second toast',
      });
    }, 100);
    setTimeout((): void => {
      helpers.warning({
        title: 'Toast 3',
        description: 'Third toast',
      });
    }, 200);
    setTimeout((): void => {
      helpers.error({
        title: 'Toast 4',
        description: 'Fourth toast',
      });
    }, 300);
    setTimeout((): void => {
      helpers.info({
        title: 'Toast 5',
        description: 'Fifth toast',
      });
    }, 400);
    setTimeout((): void => {
      helpers.success({
        title: 'Toast 6',
        description: 'Sixth toast',
      });
    }, 500);
    setTimeout((): void => {
      helpers.warning({
        title: 'Toast 7',
        description: 'Seventh toast (should remove oldest)',
      });
    }, 600);
  };
</script>

<template>
  <div
    v-if="props.variant === 'actions'"
    class="flex flex-col gap-2 p-4"
  >
    <h3 class="mb-2 text-lg font-semibold">Toast Actions</h3>
    <div class="flex flex-wrap gap-2">
      <PrimaryButton @click="showInfo">Show Info</PrimaryButton>
      <PrimaryButton @click="showError">Show Error</PrimaryButton>
      <PrimaryButton @click="showSuccess">Show Success</PrimaryButton>
      <PrimaryButton @click="showWarning">Show Warning</PrimaryButton>
      <PrimaryButton @click="showWithoutTitle">Without Title</PrimaryButton>
      <PrimaryButton @click="showPersistent">Persistent</PrimaryButton>
      <PrimaryButton @click="showCustomDuration">Custom Duration</PrimaryButton>
      <PrimaryButton
        variant="outline"
        @click="clearAll"
      >
        Clear All
      </PrimaryButton>
    </div>
  </div>
  <div
    v-else
    class="p-4"
  >
    <PrimaryButton @click="addMultipleToasts"> Add 7 Toasts (Max: 6) </PrimaryButton>
  </div>
</template>
