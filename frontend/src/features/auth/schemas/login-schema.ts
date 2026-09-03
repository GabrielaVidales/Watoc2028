import z from "zod";

export const loginSchema = z.object({
    email: z.email('Please provide a valid email address')
        .min(1, 'Email required')
        .max(100, 'Input too long'),
    password: z.string()
        .min(1, 'Password required')
        .max(100, 'Input too long'),
})

export type LoginFormValues = z.infer<typeof loginSchema>