<script setup lang="ts">
  import { ref } from 'vue';

  import { useForm } from '../../lib/composables/use-form';
  import DatePicker from '../DatePicker/DatePicker.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<{
      modelValue: Date | null;
      label?: string;
      placeholder?: string;
      required?: boolean;
    }>(),
    {
      label: '',
      placeholder: 'Select date',
      popover: () => ({}),
      required: false,
    },
  );

  const emit = defineEmits<{
    'update:modelValue': [value: Date];
  }>();

  const date = ref<Date | null>(props.modelValue);

  const form = useForm();
</script>

<template>
  <div class=":uno: space-y-1">
    <label
      v-if="label"
      :for="form.attrId"
      class=":uno: text-text-dark font-figtree line-height-normal text-base font-semibold"
    >
      {{ label }}
      <span
        v-if="required"
        class=":uno: text-destructive"
        >*</span
      >
    </label>
    <DatePicker
      :model-value="date"
      :popover="{ placement: 'top' }"
      is-required
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #default="{ togglePopover, inputValue }">
        <button
          :id="form.attrId"
          class=":uno: form-main-input flex w-full items-center justify-between rounded-lg px-5 py-2"
          @click="() => togglePopover()"
        >
          <span
            v-if="inputValue || placeholder"
            class=":uno: text-text-light"
          >
            {{ inputValue || placeholder }}
          </span>
          <i class=":uno: i-calendar size-5" />
        </button>
      </template>
    </DatePicker>
  </div>
</template>
