import z from 'zod';

export const UpdateUserInputSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  is_active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
