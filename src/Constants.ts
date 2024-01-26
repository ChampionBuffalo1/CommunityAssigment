export const isProd: boolean = process.env.NODE_ENV === 'production';
export const JwtSecret: string = process.env.JWT_SECRET || 'secret';
// If the token isn't set Number will return to 0 which can be used in boolean short-circuiting
export const API_PORT: number =
  (process.env.PORT && !Number.isNaN(+process.env.PORT) && parseInt(process.env.PORT)) || 3000;
export const maxTokenAge: number =
  (process.env.MAX_TOKEN_AGE && !Number.isNaN(+process.env.MAX_TOKEN_AGE) && parseInt(process.env.MAX_TOKEN_AGE)) ||
  1000 * 60 * 60 * 24 * 7; // 7 days

export const bcryptSaltRound = 8;
export const RESULT_PER_PAGE = 10;
export const ADMIN_ROLE_NAME = 'Community Admin',
  MOD_ROLE_NAME = 'Community Moderator';
