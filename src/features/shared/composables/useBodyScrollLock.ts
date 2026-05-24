import { type Ref, watch, onScopeDispose } from 'vue';

const LOCK_CLASS = 'noirium-modal-scroll-locked';
const SCROLL_LOCK_STYLE_ID = 'noirium-modal-scroll-lock-style';

let lockCount = 0;
let savedScrollY = 0;

const ensureStyleTag = (): void => {
  if (document.querySelector(`#${SCROLL_LOCK_STYLE_ID}`)) return;
  const style = document.createElement('style');
  style.id = SCROLL_LOCK_STYLE_ID;
  style.textContent = `.${LOCK_CLASS} { position: fixed; inset: 0; overflow: hidden; }`;
  document.head.append(style);
};

const applyLock = (): void => {
  if (lockCount > 0) return;
  ensureStyleTag();
  savedScrollY = window.scrollY;
  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add(LOCK_CLASS);
};

const releaseLock = (): void => {
  if (lockCount > 0) return;
  document.body.classList.remove(LOCK_CLASS);
  document.body.style.top = '';
  try {
    window.scrollTo(0, savedScrollY);
  } catch {
    // jsdom does not implement scrollTo
  }
};

export interface UseBodyScrollLockOptions {
  enabled?: Ref<boolean> | boolean;
}

/**
 * Ref-counted body scroll lock. Multiple components can request a lock
 * simultaneously; the lock is only released when the last consumer unlocks.
 */
export function useBodyScrollLock(
  active: Ref<boolean>,
  options: UseBodyScrollLockOptions = {},
): void {
  const { enabled = true } = options;
  let locked = false;

  const isEnabled = (): boolean => (typeof enabled === 'boolean' ? enabled : enabled.value);

  const lock = (): void => {
    if (locked) return;
    applyLock();
    lockCount += 1;
    locked = true;
  };

  const unlock = (): void => {
    if (!locked) return;
    lockCount -= 1;
    locked = false;
    releaseLock();
  };

  watch(
    active,
    (val) => {
      if (val && isEnabled()) lock();
      else unlock();
    },
    { immediate: true, flush: 'sync' },
  );

  onScopeDispose(() => {
    unlock();
  });
}
