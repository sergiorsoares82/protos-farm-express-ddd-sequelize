import { z } from 'zod';

export const CreateUserInputSchema = z.object({
  username: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
  is_active: z.boolean().optional().default(true),
  role_id: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
