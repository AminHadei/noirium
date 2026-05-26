export interface BaseDropdownItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface BaseDropdownProps<T extends BaseDropdownItem> {
  items: readonly T[];
  modelValue?: T | null;
  closeOnSelect?: boolean;
  placement?: 'bottom' | 'top';
  offset?: number;
  minWidth?: string;
  maxHeight?: string;
}
