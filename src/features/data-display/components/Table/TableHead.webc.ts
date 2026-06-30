import { TABLE_HEAD_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableHead from './TableHead.vue';

defineNoiriumElement(TABLE_HEAD_SLOT, TableHead);
