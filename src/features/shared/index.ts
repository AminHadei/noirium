export { default as Avatar } from '@/features/shared/components/Avatar/Avatar.vue';
export { default as BaseDialog } from '@/features/shared/components/BaseDialog/BaseDialog.vue';
export { default as Modal } from '@/features/shared/components/Modal/Modal.vue';
export { default as ModalLayoutDefault } from '@/features/shared/components/Modal/layouts/ModalLayoutDefault.vue';
export { default as ModalLayoutFullscreen } from '@/features/shared/components/Modal/layouts/ModalLayoutFullscreen.vue';
export {
  ModalContextKey,
  useModalContext,
  type ModalContext,
} from '@/features/shared/components/Modal/Modal.context';
export { createTypedModal } from '@/features/shared/components/Modal/Modal.factory';
export type {
  ModalProps,
  ModalClasses,
  ModalClassValue,
  ModalLayoutName,
} from '@/features/shared/components/Modal/Modal.types';
export { default as BaseDropdown } from '@/features/shared/components/BaseDropdown/BaseDropdown.vue';
export { default as Countdown } from '@/features/shared/components/Countdown/Countdown.vue';
export { default as PrimaryButton } from '@/features/shared/components/PrimaryButton/PrimaryButton.vue';
export { default as BaseBadge } from '@/features/shared/components/BaseBadge/BaseBadge.vue';
export type { BaseBadgeColor } from '@/features/shared/components/BaseBadge/base-badge.types';
export { default as Toast } from '@/features/shared/components/Toast/Toast.vue';
export { default as ToastContainer } from '@/features/shared/components/ToastContainer/ToastContainer.vue';
export { default as ToastProvider } from '@/features/shared/components/ToastProvider/ToastProvider.vue';
export { default as PhoneNumberInput } from '@/features/shared/components/PhoneNumberInput/PhoneNumberInput.vue';
export { default as CountryDropdown } from '@/features/shared/components/CountryDropdown/CountryDropdown.vue';
export { default as DatePicker } from '@/features/shared/components/DatePicker/DatePicker.vue';
export { default as DateInput } from '@/features/shared/components/DateInput/DateInput.vue';
export { default as CheckInput } from '@/features/shared/components/CheckInput/CheckInput.vue';

// Export composables
export {
  useToast,
  useToastOrNull,
  useToastOptional,
  createToastHelpers,
} from '@/features/shared/lib/composables/use-toast';
