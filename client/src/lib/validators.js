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

export const openAccountSchema = z.object({
    accountType: z.enum(['savings', 'checking'], {
        required_eerrr: 'Select an account type',
    }),
})

export const transferSchema = z.object({
    fromAccountId: z.string().min(1, 'Select an account to transfer from'),
    toAccountNumber: z.string().min(6, 'Enter a valid account number'),
    amount: z.coerce.number().positive('Amount must be greater than 0'),
})

export const loanApplicationSchema = z.object({
    accountId: z.string().min(1, 'Select an account'),
    principal: z.coerce.number().positive('Principal must be greater than 0'),
    annualInterestRate: z.coerce.number().min(0, 'Rate cannot be negative').max(50, 'Rate seems too high'),
    termMonths: z.coerce.number().int().positive('Term must be a positive number of months'),
});