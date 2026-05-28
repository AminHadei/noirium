<script setup lang="ts">
  import { useCountdown } from '@vueuse/core';
  import dayjs from 'dayjs';
  import dayjsDuration from 'dayjs/plugin/duration';
  import { computed, onMounted, onUnmounted, watch } from 'vue';

  import type { CountdownProps } from '../../lib/types';

  const pluralize = (value: number, singular: string, plural: string): string => {
    return `${value} ${value === 1 ? singular : plural}`;
  };

  dayjs.extend(dayjsDuration);

  const props = withDefaults(defineProps<CountdownProps>(), {
    showIcon: true,
    iconClass: ':uno: i-calendar-bold size-4',
    textClass: ':uno: text-text-light',
    format: 'short',
  });

  const emit = defineEmits<{
    expired: [];
    tick: [remainingMs: number];
  }>();

  const { start, remaining, stop } = useCountdown(dayjs(props.startDate).diff(dayjs(), 'second'));

  watch(
    () => remaining.value,
    (value) => {
      if (value <= 0) {
        emit('expired');
      }
    },
  );

  // format "19924602" to "17d 16h 07m 42s"
  const countdownText = computed(() => {
    const duration = dayjs.duration(remaining.value, 'seconds');
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const format = (value: number, unit: 'd' | 'h' | 'm' | 's'): string => {
      if (props.format === 'long') {
        const obj: Record<typeof unit, string> = {
          d: pluralize(value, 'day', 'days'),
          h: pluralize(value, 'hour', 'hours'),
          m: pluralize(value, 'minute', 'minutes'),
          s: pluralize(value, 'second', 'seconds'),
        };
        return obj[unit];
      }

      return `${value}${unit}`;
    };

    let content: string[] = [];

    if (days > 0) {
      content.push(
        format(seconds, 's'),
        format(minutes, 'm'),
        format(hours, 'h'),
        format(days, 'd'),
      );
    } else if (hours > 0) {
      content.push(format(seconds, 's'), format(minutes, 'm'), format(hours, 'h'));
    } else if (minutes > 0) {
      content.push(format(seconds, 's'), format(minutes, 'm'));
    } else if (seconds > 0) {
      content.push(format(seconds, 's'));
    }

    return content.toReversed().join(' ');
  });

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });
</script>

<template>
  <div class=":uno: countdown flex items-center">
    <span
      v-if="showIcon"
      :class="iconClass"
    />
    <span :class="[textClass, showIcon ? ':uno: ml-1' : '']">
      <slot
        :countdown="countdownText"
        :expired="remaining <= 0"
      >
        {{ remaining >= 0 ? `Starts in ${countdownText}` : '-' }}
      </slot>
    </span>
  </div>
</template>
