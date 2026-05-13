import z from "zod";

export const contactSchema = z.object({
    salutation: z.string().max(50, "Too long").optional(),
    academicTitle: z.string().optional(),
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim(),
    email: z.email("Invalid email address").toLowerCase(),
    institution: z.string().optional(),
    city: z.string().optional(),
    countyStateRegion: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    message: z.string().min(1, 'Message required').max(2048, "Message is too long").optional(),
});

export const contactSchemaForm = contactSchema.extend({
    acceptTerms: z.boolean().refine(val => val === true, "You must accept terms"),
});

export type ContactFormValues = z.infer<typeof contactSchemaForm>
