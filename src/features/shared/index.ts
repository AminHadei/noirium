export { default as BaseBadge } from '@/features/shared/components/BaseBadge/BaseBadge.vue';
export type { BaseBadgeColor } from '@/features/shared/components/BaseBadge/base-badge.types';
export { default as BaseDialog } from '@/features/shared/components/BaseDialog/BaseDialog.vue';
export { default as BaseDropdown } from '@/features/shared/components/BaseDropdown/BaseDropdown.vue';
export { default as PrimaryButton } from '@/features/shared/components/PrimaryButton/PrimaryButton.vue';
export { default as Toast } from '@/features/shared/components/Toast/Toast.vue';
export { default as ToastContainer } from '@/features/shared/components/ToastContainer/ToastContainer.vue';
export { default as ToastProvider } from '@/features/shared/components/ToastProvider/ToastProvider.vue';

export {
  useToast,
  useToastOrNull,
  useToastOptional,
  createToastHelpers,
} from '@/features/shared/lib/composables/use-toast';
