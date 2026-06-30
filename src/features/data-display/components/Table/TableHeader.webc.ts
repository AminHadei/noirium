import { TABLE_HEADER_SLOT } from '@/features/shared/composables/table-slots.util';
import { defineNoiriumElement } from '@/features/shared/lib/utils/define-webc.util';

import TableHeader from './TableHeader.vue';

defineNoiriumElement(TABLE_HEADER_SLOT, TableHeader);
