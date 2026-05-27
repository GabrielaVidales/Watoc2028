import z from "zod";

export const emailAddressForm = z.object({
    email: z.email('Invalid email')
})

export const resetPasswordForm = z.object({
    password: z.string()
        .min(8, "Minimum 8 characters")
        .max(100, 'Input too long')
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
    confirmPassword: z.string()
        .min(1, "Field required *")
        .max(100, 'Input too long')
})

export type EmailAddressFormValues = z.infer<typeof emailAddressForm>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordForm>

