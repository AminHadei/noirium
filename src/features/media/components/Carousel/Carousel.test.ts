import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vite-plus/test';
import { defineComponent } from 'vue';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/features/media';

const Harness = defineComponent({
  components: { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext },
  template: `
    <Carousel>
      <CarouselContent>
        <CarouselItem v-for="n in 3" :key="n">Slide {{ n }}</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  `,
});

describe('Carousel', () => {
  it('renders its slides and navigation controls', () => {
    const wrapper = mount(Harness, { attachTo: document.body });

    expect(wrapper.find('[data-slot="carousel"]').attributes('aria-roledescription')).toBe(
      'carousel',
    );
    expect(wrapper.findAll('[data-slot="carousel-item"]')).toHaveLength(3);
    expect(wrapper.find('[data-slot="carousel-previous"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="carousel-next"]').exists()).toBe(true);

    wrapper.unmount();
  });
});
