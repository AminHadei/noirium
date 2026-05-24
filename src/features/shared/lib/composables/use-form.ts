import { useAttrs } from 'vue';

import { randomInputId } from '../utils/string.util';

interface UseForm {
  attrId: string;
}

export function useForm(): UseForm {
  const id = useAttrs()['id'];
  const attrId = typeof id === 'string' ? String(useAttrs()['id']) : randomInputId();

  return {
    attrId,
  };
}
