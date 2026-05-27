<script setup lang="ts">
  import { useForm } from '../../lib/composables/use-form';

  defineOptions({
    inheritAttrs: false,
  });

  defineProps<{
    modelValue: boolean;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
  }>();

  const handleChange = (event: Event): void => {
    emit('update:modelValue', (event.target as HTMLInputElement).checked);
  };

  const form = useForm();
</script>

<template>
  <div class=":uno: flex items-start gap-2">
    <input
      :id="form.attrId"
      type="checkbox"
      class=":uno: form-main-input shrink-0 cursor-pointer"
      :class="[{ ':uno: mt-2': $slots['default'] }]"
      :checked="modelValue"
      @change="handleChange"
    />
    <label
      v-if="$slots['default']"
      :for="form.attrId"
    >
      <slot />
    </label>
  </div>
</template>

<style scoped>
  input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    /* @unocss-skip-start */
    position: relative;
    /* @unocss-skip-end */
  }

  input[type='checkbox']:checked {
    background-color: #171717;
    border-color: #171717;
  }
  /* add check icon */
  input[type='checkbox']:checked::after {
    content: '✓';
    font-size: 10px;
    color: #fff;
    /* @unocss-skip-start */
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    /* @unocss-skip-end */
    top: 50%;
    left: 50%;
    font-family: system-ui;
    font-weight: bold;
  }
</style>
