import { TABLE_BODY_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableBody from './TableBody.vue';

defineNoiriumElement(TABLE_BODY_SLOT, TableBody);
