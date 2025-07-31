import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
