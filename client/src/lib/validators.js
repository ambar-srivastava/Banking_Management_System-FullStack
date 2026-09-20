import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
    email: z.email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const openAccountSchema = z.object({
    accountType: z.enum(['savings', 'checking'], {
        required_error: 'Select an account type',
        invalid_type_error: 'Invalid account type selected'
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

export const createStaffSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['employee', 'admin'], {
        required_error: 'Select a role',
        invalid_type_error: 'Invalid role selected',
    })
})