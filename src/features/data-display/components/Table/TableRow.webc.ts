import { TABLE_ROW_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableRow from './TableRow.vue';

defineNoiriumElement(TABLE_ROW_SLOT, TableRow);
