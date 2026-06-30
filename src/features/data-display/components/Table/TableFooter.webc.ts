import { TABLE_FOOTER_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableFooter from './TableFooter.vue';

defineNoiriumElement(TABLE_FOOTER_SLOT, TableFooter);
