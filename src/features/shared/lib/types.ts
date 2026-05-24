export interface CountdownProps {
  startDate: string | Date;
  showIcon?: boolean;
  iconClass?: string;
  textClass?: string;
  updateInterval?: number;
  format?: 'short' | 'long';
}

export type ToastType = 'info' | 'error' | 'success' | 'warning';

export interface ToastOptions {
  id?: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
}

export interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

interface SimpleDateParts {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
type DateSource = Date | string | number;
type DatePickerDate = DateSource | Partial<SimpleDateParts> | null;
type DatePickerRangeObject = {
  start: Exclude<DatePickerDate, null>;
  end: Exclude<DatePickerDate, null>;
};
export type DatePickerModel = DatePickerDate | DatePickerRangeObject;

export interface PopoverOptions {
  id: PropertyKey;
  visibility: PopoverVisibility;
  isInteractive: boolean;
  autoHide: boolean;
  force: boolean;
  target: unknown;
  placement: Placement;
  modifiers: unknown;
  data: unknown;
  showDelay: number;
  hideDelay: number;
  /** Part of PopoverState (not PopoverOptions in v-calendar). Passed through via
   *  Object.assign in Popover.vue's updateState(), so it reaches Popper.js at runtime.
   *  Required for correct positioning inside Shadow DOM (web components). */
  positionFixed?: boolean;
}

type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';
type BasePlacement = 'top' | 'right' | 'bottom' | 'left';
type VariationPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';
type AutoPlacement = 'auto' | 'auto-start' | 'auto-end';
type Placement = AutoPlacement | BasePlacement | VariationPlacement;
