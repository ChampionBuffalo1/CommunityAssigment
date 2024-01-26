import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters.'),
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(6, 'Password should be at least 6 characters.'),
});

const signInSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(6),
});

const roleCreateSchema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters.'),
});

const memberCreateSchema = z.object({
  user: z.string().min(1),
  role: z.string().min(1),
  community: z.string().min(1),
});

const communityCreateSchema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters.'),
});

export { signUpSchema, signInSchema, roleCreateSchema, memberCreateSchema, communityCreateSchema };
