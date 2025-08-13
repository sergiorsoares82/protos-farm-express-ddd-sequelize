import z from 'zod';

export const DeletePersonInputSchema = z.object({
  person_id: z.string().uuid(),
});

export type DeletePersonInput = z.infer<typeof DeletePersonInputSchema>;
