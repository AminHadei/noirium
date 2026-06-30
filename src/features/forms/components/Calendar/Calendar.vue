<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { IconButton } from '@/features/buttons';
  import { TABLE_ELEMENT } from '@/features/shared/composables/table-slots.util';

  defineOptions({
    name: 'NoiriumCalendar',
  });

  const { showOutsideDays = true, weekStartsOn = 0 } = defineProps<{
    showOutsideDays?: boolean;
    weekStartsOn?: 0 | 1;
  }>();

  const model = defineModel<Date | undefined>({ default: undefined });

  const TABLE_CLASS = ':uno: w-full noirium-calendar-table';

  const today = new Date();
  const viewDate = ref(new Date(model.value ?? today));

  const monthLabel = computed(() =>
    viewDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }),
  );

  const weekdayLabels = computed(() =>
    weekStartsOn === 1
      ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  );

  interface DayCell {
    date: Date;
    outside: boolean;
  }

  const weeks = computed<DayCell[][]>(() => {
    const year = viewDate.value.getFullYear();
    const month = viewDate.value.getMonth();
    const offset = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
    const cursor = new Date(year, month, 1 - offset);

    const result: DayCell[][] = [];
    for (let week = 0; week < 6; week += 1) {
      const row: DayCell[] = [];
      for (let day = 0; day < 7; day += 1) {
        row.push({ date: new Date(cursor), outside: cursor.getMonth() !== month });
        cursor.setDate(cursor.getDate() + 1);
      }
      result.push(row);
    }
    return result;
  });

  const isSameDay = (a: Date, other: Date): boolean =>
    a.getFullYear() === other.getFullYear() &&
    a.getMonth() === other.getMonth() &&
    a.getDate() === other.getDate();

  const isSelected = (date: Date): boolean =>
    model.value !== undefined && isSameDay(date, model.value);

  const isToday = (date: Date): boolean => isSameDay(date, today);

  const prevMonth = (): void => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
  };

  const nextMonth = (): void => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
  };

  const select = (cell: DayCell): void => {
    if (!cell.outside || showOutsideDays) {
      model.value = cell.date;
    }
  };
</script>

<template>
  <div
    data-slot="calendar"
    class=":uno: border-border text-text-dark inline-block rounded-lg border-1 bg-white p-3 shadow-sm"
  >
    <div class=":uno: mb-2 flex items-center justify-between">
      <IconButton
        variant="outline"
        size="sm"
        aria-label="Previous month"
        @click="prevMonth"
      >
        <span class=":uno: i-chevron-right size-4 rotate-180" />
      </IconButton>
      <span
        data-slot="calendar-label"
        class=":uno: font-figtree text-sm font-semibold"
      >
        {{ monthLabel }}
      </span>
      <IconButton
        variant="outline"
        size="sm"
        aria-label="Next month"
        @click="nextMonth"
      >
        <span class=":uno: i-chevron-right size-4" />
      </IconButton>
    </div>

    <component
      :is="TABLE_ELEMENT"
      :class="TABLE_CLASS"
    >
      <thead>
        <tr>
          <th
            v-for="label in weekdayLabels"
            :key="label"
            class=":uno: text-text-light size-9 text-xs font-normal"
          >
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(week, weekIndex) in weeks"
          :key="weekIndex"
        >
          <td
            v-for="cell in week"
            :key="cell.date.toISOString()"
            class=":uno: p-0 text-center"
          >
            <button
              v-if="showOutsideDays || !cell.outside"
              type="button"
              data-slot="calendar-day"
              :data-selected="isSelected(cell.date) ? '' : undefined"
              :data-today="isToday(cell.date) ? '' : undefined"
              :aria-pressed="isSelected(cell.date)"
              class=":uno: hover:bg-surface focus-visible:outline-text-light size-9 rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              :class="[
                cell.outside ? ':uno: text-text-light opacity-60' : '',
                isToday(cell.date) && !isSelected(cell.date) ? ':uno: bg-surface font-medium' : '',
                isSelected(cell.date) ? ':uno: bg-primary font-semibold text-white' : '',
              ]"
              @click="select(cell)"
            >
              {{ cell.date.getDate() }}
            </button>
          </td>
        </tr>
      </tbody>
    </component>
  </div>
</template>

<style scoped>
  /* @unocss-skip-start */
  .noirium-calendar-table {
    border-collapse: collapse;
  }
  /* @unocss-skip-end */
</style>
