import z from 'zod';

export const UpdatePersonInputSchema = z.object({
  person_id: z.string().uuid(),
  name: z.string().nonempty().optional(),
  person_type: z.enum(['física', 'jurídica']).optional(),
  document_number: z.string().nonempty().optional(),
  company_name: z.string().nonempty().optional(),
  is_active: z.boolean().optional(),
});

export type UpdatePersonInput = z.infer<typeof UpdatePersonInputSchema>;
