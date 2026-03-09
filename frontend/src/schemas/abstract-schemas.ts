import z from "zod";
import countries from '@/data/countries-list.json'


const countriesArray = countries.map(country => country.code)

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


export const authorAffiliationSchema = z.object({
    id: z.number()
        .optional(),
    institute: z.string().trim()
        .min(1, 'Required')
        .max(100, 'Input too long')
        .default(''),
    department: z.string().trim()
        .min(1, 'Required')
        .max(100, 'Input too long')
        .default(''),
    nationality: z.enum(countriesArray, 'Choose a valid option')
        .default(''),
    city: z.string().trim()
        .min(1, "Please enter your city")
        .max(30, 'Input too long')
        .default(''),
})

export const authorSchema = z.object({
    id: z.number()
        .optional(),
    first_name: z.string()
        .min(1, "Name required")
        .max(100, 'Input too long')
        .default(''),
    last_name: z.string()
        .min(1, "Name required")
        .max(100, 'Input too long')
        .default(''),
    email: z.email('Please provide a valid email address')
        .max(100, 'Input too long')
        .default(''),

    order: z.number()
        .optional(),
    is_corresponding: z.boolean()
        .default(false),

    affiliation: authorAffiliationSchema
        .optional()
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
        .refine((val) => countWords(val, 350), "Abstract must be at most 350 words")
        .refine((val) => !countWords(val, 199), "Abstract must be at least 200 words")
        .default(''),

    authors: z.array(authorSchema)
        .min(1, "At least one author is required")
        .superRefine((authors, ctx) => {
            if (authors.length === 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: "No authors",
                    path: ['root'],
                });
            }
        })
        .optional()
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
})
    .refine((data) => {
        if (data.authors.length > 0 && !data.authorsConsent) {
            return false;
        }
        return true;
    }, {
        message: "Debes confirmar que los co-autores otorgan su consentimiento",
        path: ["authorsConsent"],
    })

// Default values
export const authorDefaults: z.input<typeof authorSchema> = authorSchema.partial().parse({
    affiliation: {}
})


export const submitAbstractDefaults = abstractSchema.extend({
    authorsConsent: z.boolean().default(false)
})

export const validateAbstractsSchema = abstractSchema.omit({ authors: true })
export const validateAuthorsSchema = abstractSchema.pick({ authors: true })




export type AbstractSchema = z.infer<typeof abstractSchema>

export type AuthorSchema = z.infer<typeof authorSchema>


export type AbstractFormValues = z.infer<typeof submitAbstractSchema>

export type AuthorAffiliationSchema = z.infer<typeof authorAffiliationSchema>

const countWords = (input: string, limit: number) => {
    if (!input)
        return true
    return input.split(/\s+/).filter(Boolean).length <= limit
}