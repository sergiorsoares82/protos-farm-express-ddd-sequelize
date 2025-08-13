import { z } from 'zod';

export const SearchPersonsInputSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  per_page: z.coerce.number().min(1).max(100).optional(),
  sort: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
  filter: z.string().optional(),
});

export type SearchPersonsInput = z.infer<typeof SearchPersonsInputSchema>;
