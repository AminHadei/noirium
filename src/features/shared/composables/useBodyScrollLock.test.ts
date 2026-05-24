import { afterEach, describe, expect, it } from 'vite-plus/test';
import { effectScope, ref } from 'vue';

import { useBodyScrollLock } from '@/features/shared/composables/useBodyScrollLock';

const LOCK_CLASS = 'noirium-modal-scroll-locked';

describe('useBodyScrollLock', () => {
  const scopes: ReturnType<typeof effectScope>[] = [];

  afterEach(() => {
    while (scopes.length > 0) scopes.pop()?.stop();
    document.body.classList.remove(LOCK_CLASS);
    document.body.style.top = '';
  });

  const run = (fn: () => void): ReturnType<typeof effectScope> => {
    const scope = effectScope();
    scope.run(fn);
    scopes.push(scope);
    return scope;
  };

  it('locks the body when active becomes true', () => {
    const active = ref(false);
    run(() => {
      useBodyScrollLock(active);
    });

    expect(document.body.classList.contains(LOCK_CLASS)).toBe(false);
    active.value = true;
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(true);
  });

  it('releases the lock when active becomes false', () => {
    const active = ref(true);
    run(() => {
      useBodyScrollLock(active);
    });
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(true);

    active.value = false;
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(false);
  });

  it('keeps the lock while any consumer is still active (ref-counted)', () => {
    const a = ref(true);
    const b = ref(true);
    run(() => {
      useBodyScrollLock(a);
    });
    run(() => {
      useBodyScrollLock(b);
    });

    expect(document.body.classList.contains(LOCK_CLASS)).toBe(true);

    a.value = false;
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(true);

    b.value = false;
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(false);
  });

  it('releases the lock when the scope is disposed while active', () => {
    const active = ref(true);
    const scope = run(() => {
      useBodyScrollLock(active);
    });
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(true);

    scope.stop();
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(false);
  });

  it('does not lock when enabled is false', () => {
    const active = ref(true);
    run(() => {
      useBodyScrollLock(active, { enabled: false });
    });
    expect(document.body.classList.contains(LOCK_CLASS)).toBe(false);
  });
});
