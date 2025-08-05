import z from 'zod';

export const UpdateUserInputSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  is_active: z.boolean().optional(),
  role_id: z.string().optional().nullable(), // Optional role ID, can be null if no role assigned
});

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
