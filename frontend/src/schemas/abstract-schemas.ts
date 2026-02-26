import z from "zod";

export const presentationTypes = [
    {
        value: 'oral',
        label: 'Oral Presentation'
    },
    {
        value: 'poster',
        label: 'Poster Presentation'
    },
]


export const authorSchema = z.object({
    firstName: z.string()
        .min(1, "Name required")
        .max(100, 'Input too long')
        .default(''),
    lastName: z.string()
        .min(1, "Name required")
        .max(100, 'Input too long')
        .default(''),
    email: z.email('Please provide a valid email address')
        .max(100, 'Input too long')
        .default(''),
    order: z.number()
        .default(1)
        .optional(),
    is_corresponding: z.boolean()
        .default(false)
})


export const abstractSchema = z.object({
    id: z.number().nullable().optional().default(null),

    title: z.string()
        .min(1, "Please enter the abstract title")
        .refine((val) => countWords(val, 10), "The abstract title must not exceed 10 words.")
        .default(''),

    presentation_type: z.enum(presentationTypes.map(v => v.value), 'Opción no válida')
        .default(''),

    text: z.string()
        .refine((val) => countWords(val, 500), "Abstract must be at most 500 words")
        .refine((val) => !countWords(val, 199), "Abstract must be at least 200 words")
        .default(''),

    authors: z.array(authorSchema)
        .min(1, "At least one author is required")
        .superRefine((authors, ctx) => {
            const correspondingCount = authors.filter(a => a.is_corresponding).length;
            console.log(correspondingCount);

            if (correspondingCount !== 1) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Exactly one (1) corresponding author must be designated",
                    path: [],
                });
            }
        })
        .default([]),

    references: z.string()
        .min(1, "Please provide the references")
        .refine((val) => countWords(val, 150), "References must be at most 150 words")
        .default(''),

    status: z.string().optional(),

    created_at: z.coerce.date().optional(),

    last_update: z.coerce.date().optional(),

    last_review_at: z.coerce.date().optional(),

    user: z.number().optional()
})


export const submitAbstractSchema = abstractSchema.extend({
    authorsConsent: z.boolean()
        .default(false)
        .refine((v) => v === true, {
            message: "You must accept the ethical statement.",
        }),
}).refine((data) => {
    if (data.authors.length > 0 && !data.authorsConsent) {
        return false;
    }
    return true;
}, {
    message: "Debes confirmar que los co-autores otorgan su consentimiento",
    path: ["authorsConsent"],
})

export const submitAbstractDefaults = abstractSchema.extend({
    authorsConsent: z.boolean().default(false)
})


export type AbstractSchema = z.infer<typeof abstractSchema>

export type AbstractFormValues = z.infer<typeof submitAbstractSchema>


const countWords = (input: string, limit: number) => {
    if (!input)
        return true
    return input.split(/\s+/).filter(Boolean).length <= limit
}