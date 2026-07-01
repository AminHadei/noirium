import type { EmblaCarouselType } from 'embla-carousel';
import type { InjectionKey, Ref } from 'vue';

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselContext {
  carouselRef: Ref<HTMLElement | undefined>;
  api: Ref<EmblaCarouselType | undefined>;
  orientation: CarouselOrientation;
  canScrollPrev: Ref<boolean>;
  canScrollNext: Ref<boolean>;
  scrollPrev: () => void;
  scrollNext: () => void;
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol('NoiriumCarousel');
