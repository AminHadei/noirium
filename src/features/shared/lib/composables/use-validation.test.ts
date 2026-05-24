import * as v from 'valibot';
import { describe, it, expect } from 'vite-plus/test';

import { useValidation } from './use-validation';

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(2, 'Name too short')),
  age: v.pipe(v.number(), v.minValue(18, 'Age too low')),
});

type Form = v.InferInput<typeof schema>;
const initial: Form = { name: '', age: 0 };

describe('useValidation', () => {
  it('initializes with provided data, no errors and not dirty', () => {
    const v = useValidation(schema, initial);

    expect(v.data.value).toEqual(initial);
    expect(v.errors.value).toEqual({});
    expect(v.isDirty.value).toBe(false);
    expect(v.isValid.value).toBe(true);
  });

  it('validate() returns true and clears errors for valid data', async () => {
    const v = useValidation(schema, { name: 'Alice', age: 25 });

    const ok = await v.validate();
    expect(ok).toBe(true);
    expect(v.errors.value).toEqual({});
    expect(v.isValidating.value).toBe(false);
  });

  it('validate() returns false and populates errors for invalid data', async () => {
    const v = useValidation(schema, initial);

    const ok = await v.validate();
    expect(ok).toBe(false);
    expect(v.errors.value['name']).toEqual(['Name too short']);
    expect(v.errors.value['age']).toEqual(['Age too low']);
    expect(v.isValid.value).toBe(false);
  });

  it('validateField() returns true for a valid field, removes its error', async () => {
    const v = useValidation(schema, { name: 'Alice', age: 25 });

    const ok = await v.validateField('name');
    expect(ok).toBe(true);
    expect(v.errors.value['name']).toBeUndefined();
  });

  it('validateField() sets error only for the provided field when invalid', async () => {
    const v = useValidation(schema, initial);

    const ok = await v.validateField('name');
    expect(ok).toBe(false);
    expect(v.errors.value['name']).toEqual(['Name too short']);
    expect(v.errors.value['age']).toBeUndefined();
  });

  it('validateField() clears stale error for a field that is now valid while others remain invalid', async () => {
    const v = useValidation(schema, initial);

    await v.validate();
    expect(v.errors.value['name']).toBeDefined();
    expect(v.errors.value['age']).toBeDefined();

    v.setFieldValue('name', 'Alice');
    const ok = await v.validateField('name');
    expect(ok).toBe(false);
    expect(v.errors.value['name']).toBeUndefined();
    expect(v.errors.value['age']).toEqual(['Age too low']);
  });

  it('setFieldValue updates data and marks dirty', () => {
    const v = useValidation(schema, initial);

    v.setFieldValue('name', 'Bob');
    expect(v.data.value.name).toBe('Bob');
    expect(v.isDirty.value).toBe(true);
  });

  it('getFieldError returns first error or null', async () => {
    const v = useValidation(schema, initial);
    expect(v.getFieldError('name')).toBeNull();

    await v.validate();
    expect(v.getFieldError('name')).toBe('Name too short');
  });

  it('hasFieldError reflects presence of errors for a field', async () => {
    const v = useValidation(schema, initial);
    expect(v.hasFieldError('name')).toBe(false);

    await v.validate();
    expect(v.hasFieldError('name')).toBe(true);
  });

  it('reset() restores initial data and clears errors and dirty flag', async () => {
    const v = useValidation(schema, initial);
    v.setFieldValue('name', 'Bob');
    await v.validate();

    v.reset();
    expect(v.data.value).toEqual(initial);
    expect(v.errors.value).toEqual({});
    expect(v.isDirty.value).toBe(false);
  });

  it('setErrors() sets errors and defaults to empty object', () => {
    const v = useValidation(schema, initial);

    v.setErrors({ name: ['custom'] });
    expect(v.errors.value).toEqual({ name: ['custom'] });

    v.setErrors({});
    expect(v.errors.value).toEqual({});
  });
});
