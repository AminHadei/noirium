<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue';

  import { randomInputId } from '@/features/shared/lib/utils/string.util';

  import CountryDropdown from '../CountryDropdown/CountryDropdown.vue';
  import { countryTranslations, countryShortNames, type Iso2 } from './data';

  defineOptions({
    inheritAttrs: false,
  });

  export interface PhoneNumberInputProps {
    label?: string;
    required?: boolean;
    modelValue?: string | null;
    countryCode?: Iso2 | null;
    flagPlaceholder?: string;
    error?: string | null;
    clearError?: () => void;
  }

  const props = withDefaults(defineProps<PhoneNumberInputProps>(), {
    label: '',
    required: false,
    modelValue: null,
    countryCode: 'us',
    flagPlaceholder: 'Example: +1 3052378809',
    error: null,
    clearError: () => {},
  });

  const attrsId = computed<string | undefined>(() =>
    useAttrs()['id'] ? String(useAttrs()['id']) : randomInputId(),
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    'update:countryCode': [value: Iso2 | null];
    'update:phoneNumber': [
      value: { countryCode: Iso2 | null; phoneNumber: string; fullNumber: string },
    ];
  }>();

  const selectedCountry = ref<Iso2 | null>(props.countryCode);
  const phoneInput = ref('');
  const isDropdownOpen = ref(false);
  const inputRef = ref<HTMLInputElement | null>(null);
  const flagButtonRef = ref<HTMLButtonElement | null>(null);
  const containerRef = ref<HTMLElement | null>(null);

  const currentCountry = computed(() =>
    selectedCountry.value ? countryTranslations[selectedCountry.value] : null,
  );

  // Try to match country code from input
  const findCountryByCode = (code: string): Iso2 | null => {
    const numericCode = Number.parseInt(code.replaceAll('+', ''), 10);

    const found = countryShortNames.find((iso) => countryTranslations[iso].code === numericCode);
    return found || null;
  };

  // Parse phone input to extract country code and phone number
  const parsePhoneInput = (value: string): { countryCode: string; phoneNumber: string } => {
    // Find the longest matching country code
    let matchedCountry: Iso2 | null = null;
    let matchedCode = '';

    // Sort countries by code length (longest first) to match longer codes first
    const sortedCountries = [...countryShortNames].toSorted((a, b) => {
      const codeA = countryTranslations[a].code.toString();
      const codeB = countryTranslations[b].code.toString();
      return codeB.length - codeA.length;
    });

    for (const iso of sortedCountries) {
      const code = `+${countryTranslations[iso].code}`;
      if (value.startsWith(code)) {
        matchedCountry = iso;
        matchedCode = code;
        break;
      }
    }

    if (matchedCountry) {
      const phoneNumber = value.slice(matchedCode.length).replaceAll(/\D/g, '');
      return { countryCode: matchedCode, phoneNumber };
    }

    // If no match, try to extract code from beginning
    const codeMatch = value.match(/^(\+\d{1,4})/);
    if (codeMatch && codeMatch[1]) {
      const code = codeMatch[1];
      const phoneNumber = value.slice(code.length).replaceAll(/\D/g, '');
      return { countryCode: code, phoneNumber };
    }

    // Default to current country if selected, otherwise just return the input
    if (currentCountry.value) {
      const defaultCode = `+${currentCountry.value.code}`;
      const phoneNumber = value.replace(/^\+/, '').replaceAll(/\D/g, '');
      return { countryCode: defaultCode, phoneNumber };
    }

    // No country selected, return empty code
    const phoneNumber = value.replace(/^\+/, '').replaceAll(/\D/g, '');
    return { countryCode: '', phoneNumber };
  };

  // Update phone number and emit
  const updatePhoneNumber = (
    fullValue?: string,
    countryCode?: string,
    phoneNumber?: string,
  ): void => {
    // If input is just '+', emit it as is
    if (fullValue === '+' || (!fullValue && !countryCode)) {
      emit('update:modelValue', '+');
      emit('update:phoneNumber', {
        countryCode: selectedCountry.value,
        phoneNumber: '',
        fullNumber: '+',
      });
      props.clearError();
      return;
    }

    const parsed = fullValue
      ? parsePhoneInput(fullValue)
      : {
          countryCode: currentCountry.value ? `+${currentCountry.value.code}` : '',
          phoneNumber: '',
        };
    const code = countryCode || parsed.countryCode;
    const number = phoneNumber || parsed.phoneNumber;
    const fullNumber = `${code}${number}`;

    emit('update:modelValue', fullNumber);
    emit('update:phoneNumber', {
      countryCode: selectedCountry.value,
      phoneNumber: number,
      fullNumber,
    });
    props.clearError();
  };

  // Handle phone input changes
  const handlePhoneInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    // Only allow + and numbers
    value = value.replaceAll(/[^+\d]/g, '');

    phoneInput.value = value;

    // Parse and try to match country
    const { countryCode, phoneNumber } = parsePhoneInput(value);
    const matchedCountry = findCountryByCode(countryCode);

    if (matchedCountry && matchedCountry !== selectedCountry.value) {
      selectedCountry.value = matchedCountry;
      emit('update:countryCode', matchedCountry);
    }

    updatePhoneNumber(value, countryCode, phoneNumber);
  };

  // Handle country selection from dropdown
  const handleCountrySelect = (countryCode: Iso2 | null): void => {
    if (!countryCode) {
      return;
    }
    selectedCountry.value = countryCode;
    const countryCodeStr = `+${countryTranslations[countryCode].code}`;
    // Remove existing code
    const currentNumber = phoneInput.value.replace(/^\+\d+/, '');
    phoneInput.value = countryCodeStr + currentNumber;
    emit('update:countryCode', countryCode);
    updatePhoneNumber(phoneInput.value, countryCodeStr, currentNumber);
    isDropdownOpen.value = false;
    // Focus back on input
    inputRef.value?.focus();
  };

  const dropdownWidth = computed(() => {
    if (containerRef.value) {
      return `${containerRef.value.offsetWidth}px`;
    }
    return '';
  });
</script>

<template>
  <div class=":uno: relative space-y-1">
    <label
      v-if="label"
      class=":uno: text-text-dark font-figtree text-base font-semibold"
      :for="attrsId"
    >
      {{ label }}
      <span
        v-if="required"
        class=":uno: text-destructive"
        >*</span
      >
    </label>
    <div
      ref="containerRef"
      class=":uno: focus-within:ring-primary/20 relative flex items-center rounded-lg border px-5 py-2 transition-all focus-within:ring-2"
      :class="[
        error
          ? ':uno: border-destructive'
          : ':uno: focus-within:border-primary border-border hover:border-border-hover',
      ]"
    >
      <!-- Flag Button -->
      <CountryDropdown
        :model-value="selectedCountry"
        :visible="isDropdownOpen"
        :width="dropdownWidth"
        :ignore="[flagButtonRef]"
        @update:visible="isDropdownOpen = $event"
        @update:model-value="handleCountrySelect"
        @select="handleCountrySelect"
      >
        <button
          ref="flagButtonRef"
          type="button"
          class=":uno: flex min-w-6 items-center justify-center transition-colors hover:bg-gray-50"
          :title="currentCountry ? currentCountry.name : flagPlaceholder"
        >
          <img
            v-if="currentCountry"
            :src="currentCountry.flag"
            :alt="currentCountry.name"
            class=":uno: size-4"
          />
          <div
            v-else
            class=":uno: flex size-4 items-center justify-center rounded-sm bg-gray-300 text-[8px] text-gray-600"
            :aria-label="flagPlaceholder"
          >
            ?
          </div>
        </button>
      </CountryDropdown>

      <!-- separator -->
      <div class=":uno: mx-2 h-5 w-px bg-border" />

      <!-- Single Phone Number Input -->
      <input
        ref="inputRef"
        :id="attrsId"
        v-model="phoneInput"
        type="tel"
        class=":uno: flex-1 border-none outline-none focus:ring-0"
        :placeholder="flagPlaceholder"
        @input="handlePhoneInput"
      />
    </div>
    <span
      v-if="error"
      class=":uno: absolute text-sm text-destructive"
      >{{ error }}</span
    >
  </div>
</template>

<style scoped>
  input::placeholder {
    color: #a3a3a3;
  }
</style>
