import { safeParseAsync, type BaseIssue, type BaseSchema, type BaseSchemaAsync } from 'valibot';
import { ref, computed, type Ref } from 'vue';

export interface ValidationState<T> {
  data: Ref<T>;
  errors: Ref<Record<string, string[]>>;
  isValidating: Ref<boolean>;
  isValid: Ref<boolean>;
  isDirty: Ref<boolean>;
  validate: () => Promise<boolean>;
  validateField: (field: keyof T) => Promise<boolean>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  getFieldError: (field: keyof T) => string | null;
  hasFieldError: (field: keyof T) => boolean;
  reset: () => void;
  setErrors: (errors: Record<string, string[]>) => void;
}

type ValidationSchema<T> =
  | BaseSchema<T, T, BaseIssue<unknown>>
  | BaseSchemaAsync<T, T, BaseIssue<unknown>>;

const parseValibotIssues = (
  issues: readonly [BaseIssue<unknown>, ...BaseIssue<unknown>[]],
): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const path = issue.path?.map((segment) => String(segment.key)).join('.') ?? '';
    fieldErrors[path] ??= [];
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
};

// oxlint-disable-next-line max-lines-per-function
export function useValidation<T extends Record<string, unknown>>(
  schema: ValidationSchema<T>,
  initialData: T,
): ValidationState<T> {
  const data = ref({
    ...initialData,
  }) as Ref<T>;
  const errors = ref<Record<string, string[]>>({});
  const isValidating = ref(false);
  const isDirty = ref(false);

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  const validate = async (): Promise<boolean> => {
    isValidating.value = true;

    try {
      const result = await safeParseAsync(schema, data.value);
      if (result.success) {
        errors.value = {};
        return true;
      }
      errors.value = parseValibotIssues(result.issues);
      return false;
    } finally {
      isValidating.value = false;
    }
  };

  const validateField = async (field: keyof T): Promise<boolean> => {
    isValidating.value = true;

    try {
      const result = await safeParseAsync(schema, data.value);

      if (result.success) {
        const newErrors = {
          ...errors.value,
        };
        // oxlint-disable-next-line typescript/no-dynamic-delete
        delete newErrors[field as string];
        errors.value = newErrors;
        return true;
      }

      const fieldErrors = parseValibotIssues(result.issues);
      const fieldKey = field as string;

      if (fieldErrors[fieldKey]) {
        errors.value = {
          ...errors.value,
          [fieldKey]: fieldErrors[fieldKey],
        };
      } else {
        const newErrors = {
          ...errors.value,
        };
        // oxlint-disable-next-line typescript/no-dynamic-delete
        delete newErrors[fieldKey];
        errors.value = newErrors;
      }
      return false;
    } finally {
      isValidating.value = false;
    }
  };

  const setFieldValue = (field: keyof T, value: unknown): void => {
    data.value = {
      ...data.value,
      [field]: value,
    };
    isDirty.value = true;
  };

  const getFieldError = (field: keyof T): string | null => {
    const fieldErrors = errors.value[field as string];
    return fieldErrors && fieldErrors.length > 0 ? (fieldErrors?.[0] ?? null) : null;
  };

  const hasFieldError = (field: keyof T): boolean => {
    // oxlint-disable-next-line typescript/no-non-null-assertion
    return !!(errors.value[field as string] && errors.value[field as string]!.length > 0);
  };

  const reset = (): void => {
    data.value = {
      ...initialData,
    };
    errors.value = {};
    isDirty.value = false;
  };

  const setErrors = (newErrors: Record<string, string[]> = {}): void => {
    errors.value = newErrors;
  };

  return {
    data,
    errors,
    isValidating,
    isValid,
    isDirty,
    validate,
    validateField,
    setFieldValue,
    getFieldError,
    hasFieldError,
    reset,
    setErrors,
  };
}
