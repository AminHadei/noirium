<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

  import type { TocItem } from './toc.types';

  defineOptions({
    name: 'NoiriumTableOfContents',
  });

  const { depth = 2, data = [] } = defineProps<{
    depth?: number;
    data?: TocItem[];
  }>();

  const items = ref<TocItem[]>(data.length > 0 ? data : []);
  const activeId = ref<string | null>(null);
  let observer: IntersectionObserver | null = null;

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^\w-]/g, '');

  const collectFromDom = (): TocItem[] => {
    const selector = Array.from({ length: depth }, (_, i) => `h${i + 1}`).join(', ');
    const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>(selector));

    return headings
      .map((heading): TocItem => {
        const id = heading.id === '' ? slugify(heading.textContent ?? '') : heading.id;
        if (heading.id === '' && id !== '') {
          heading.id = id;
        }
        return { id, title: heading.textContent ?? '', depth: Number(heading.tagName.charAt(1)) };
      })
      .filter((item) => item.id !== '');
  };

  onMounted(() => {
    if (data.length > 0) return;

    items.value = collectFromDom();

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeId.value = entry.target.id;
            }
          }
        },
        { rootMargin: '-20% 0% -35% 0%' },
      );
      const headingSelector = Array.from({ length: 6 }, (_, i) => `h${i + 1}`).join(', ');
      for (const heading of document.querySelectorAll(headingSelector)) {
        observer.observe(heading);
      }
    }
  });

  onBeforeUnmount(() => observer?.disconnect());

  const minDepth = computed(() => {
    let lowest = 6;
    for (const item of items.value) {
      lowest = Math.min(lowest, item.depth);
    }
    return lowest;
  });

  const indentFor = (itemDepth: number): string => `${(itemDepth - minDepth.value) * 12 + 8}px`;
</script>

<template>
  <nav
    v-if="items.length > 0"
    data-slot="toc"
    class=":uno: border-border h-60 w-52 overflow-y-auto rounded-lg border-1 p-4 shadow-sm"
  >
    <slot />
    <ul class=":uno: space-y-1">
      <li
        v-for="item in items"
        :key="item.id"
      >
        <a
          :href="`#${item.id}`"
          :style="{ paddingLeft: indentFor(item.depth) }"
          class=":uno: block max-w-full truncate border-l-2 py-1 text-sm transition-colors"
          :class="
            activeId === item.id
              ? ':uno: border-primary bg-surface text-text-darker font-medium'
              : ':uno: hover:border-border hover:text-text-darker text-text-dark border-transparent'
          "
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>
