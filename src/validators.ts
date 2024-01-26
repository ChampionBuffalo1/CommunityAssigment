import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, 'name should be at least 2 character'),
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(6),
});

const roleCreateSchema = z.object({
  name: z.string().min(2, 'role name must be at least 2 characters'),
});

const memberCreateSchema = z.object({
  user: z.string().min(1),
  role: z.string().min(1),
  community: z.string().min(1),
});

const communityCreateSchema = z.object({
  name: z.string().min(2, 'community name should be at least 2 characters'),
});

export { signUpSchema, signInSchema, roleCreateSchema, memberCreateSchema, communityCreateSchema };
