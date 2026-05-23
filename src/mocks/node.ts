import { setupServer } from 'msw/node';

/**
 * Aggregates MSW handlers for Vitest. Add feature handlers here when mocking API calls:
 *
 * ```ts
 * import { myFeatureMockHandlers } from '@/features/my-feature/lib/__mock__';
 * const handlers = [...myFeatureMockHandlers];
 * ```
 */
const handlers: Parameters<typeof setupServer> = [];

export const server = setupServer(...handlers);
