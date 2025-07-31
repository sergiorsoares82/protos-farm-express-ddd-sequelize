import z from 'zod';

export const DeleteUserInputSchema = z.object({
  user_id: z.string().uuid(),
});

export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;
