import { type Ref, getCurrentInstance, onMounted, ref } from 'vue';

export function useTeleportTarget(defaultTarget: string = 'body'): Ref<string | ShadowRoot> {
  const teleportTarget = ref<string | ShadowRoot>(defaultTarget);

  onMounted(() => {
    const instance = getCurrentInstance();
    if (!instance) return;

    try {
      const el = instance.vnode.el as Node | null;
      if (el) {
        const rootNode = el.getRootNode();
        if (rootNode instanceof ShadowRoot) {
          teleportTarget.value = rootNode;
        }
      }
    } catch {
      // fall back to defaultTarget
    }
  });

  return teleportTarget;
}
