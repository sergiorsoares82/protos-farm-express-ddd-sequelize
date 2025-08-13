import z from 'zod';
import { CreateUserInputSchema } from '../../users/dto/create-user.input';

const CreateUserInputSchemaWithoutPersonId = CreateUserInputSchema.omit({
  person_id: true,
});

export const CreatePersonInputSchema = z.object({
  name: z.string().min(2).max(100),
  person_type: z.enum(['física', 'jurídica']),
  document_number: z.string().min(5).max(20),
  company_name: z.string().min(2).max(100).optional().nullable(),
  is_active: z.boolean().optional().default(true),
  user: CreateUserInputSchemaWithoutPersonId.optional(),
});

export type CreatePersonInput = z.infer<typeof CreatePersonInputSchema>;
