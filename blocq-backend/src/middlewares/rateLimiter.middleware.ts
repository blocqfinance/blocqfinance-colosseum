import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per IP
    message: 'Too many login attempts, please try again after 10 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
