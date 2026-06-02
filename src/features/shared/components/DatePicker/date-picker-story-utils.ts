/** Coerce Storybook date controls (string/number) into values v-calendar accepts. */
export function coerceDatePickerModelValue(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return new Date(value);
  }
  if (typeof value === 'string' && value.length > 0) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}
