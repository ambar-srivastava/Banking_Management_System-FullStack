import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});