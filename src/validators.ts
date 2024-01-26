import { z } from 'zod';

const signUpSchema = z.object({
  name: z
    .string({
      required_error: 'Name should be at least 2 characters.',
    })
    .min(2, 'Name should be at least 2 characters.'),
  email: z
    .string({
      required_error: 'Please provide a valid email address.',
    })
    .email('Please provide a valid email address.'),
  password: z
    .string({
      required_error: 'Password should be at least 6 characters.',
    })
    .min(6, 'Password should be at least 6 characters.'),
});

const signInSchema = z.object({
  email: z
    .string({
      required_error: 'Please provide a valid email address.',
    })
    .email('Please provide a valid email address.'),
  password: z
    .string({
      required_error: 'Password should be at least 6 characters.',
    })
    .min(6, 'Password should be at least 6 characters.'),
});

const roleCreateSchema = z.object({
  name: z
    .string({
      required_error: 'Name should be at least 2 characters.',
    })
    .min(2, 'Name should be at least 2 characters.'),
});

const memberCreateSchema = z.object({
  user: z.string({
    required_error: 'User ID is missing',
  }),
  role: z.string({
    required_error: 'role ID is missing',
  }),
  community: z.string({
    required_error: 'community ID is missing',
  }),
});

const communityCreateSchema = z.object({
  name: z
    .string({
      required_error: 'Name should be at least 2 characters.',
    })
    .min(2, 'Name should be at least 2 characters.'),
});

export { signUpSchema, signInSchema, roleCreateSchema, memberCreateSchema, communityCreateSchema };
