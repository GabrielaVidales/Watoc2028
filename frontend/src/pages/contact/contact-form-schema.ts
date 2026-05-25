import z from "zod";

type ContactSubject = {
    value: string
    label: string
}

export const contactSubject: ContactSubject[] = [
    { value: '0', label: 'Posters' },
    { value: '1', label: 'Talks' },
    { value: '2', label: 'Visa letters' },
    { value: '3', label: 'Payment' },
    { value: '4', label: 'Other' },
]

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
    subject: z.enum(contactSubject.map(i => i.value), 'Invalid option')
});

export const contactSchemaForm = contactSchema.extend({
    acceptTerms: z.boolean().refine(val => val === true, "You must accept terms"),
});

export type ContactFormValues = z.infer<typeof contactSchemaForm>
