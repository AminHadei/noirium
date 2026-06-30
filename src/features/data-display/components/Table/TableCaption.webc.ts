import { TABLE_CAPTION_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableCaption from './TableCaption.vue';

defineNoiriumElement(TABLE_CAPTION_SLOT, TableCaption);
