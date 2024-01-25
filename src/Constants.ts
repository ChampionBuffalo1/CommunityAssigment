export const isProd: boolean = process.env.NODE_ENV === 'production';
export const JwtSecret: string = process.env.JWT_SECRET || 'secret';
// If the token isn't set Number will return to 0 which can be used in boolean short-circuiting
export const API_PORT: number = Number(process.env.PORT) || 8080;
export const maxTokenAge: number = Number(process.env.MAX_TOKEN_AGE) || 1000 * 60 * 60 * 24 * 7; // 7 days

export const bcryptSaltRound = 8;
