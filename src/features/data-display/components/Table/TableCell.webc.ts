import { TABLE_CELL_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableCell from './TableCell.vue';

defineNoiriumElement(TABLE_CELL_SLOT, TableCell);
