import { countWordsFromHTML } from "@/components/EnrichedTextArea";
import { countries } from "@/utils/countriesInfo";
import z from "zod";
import { userSchema } from "../user-schemas";


const countriesArray = countries.map(country => country.value)

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

export const ABSTRACT_STATUS = [
    "draft",
    "submitted",
    "accepted",
    "rejected",
    "corrections",
    "deleted"
] as const;

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

    affiliation: authorAffiliationSchema
        .optional()
})

export const abstractSchema = z.object({
    id: z.number().nullable().optional(),

    title: z.string()
        .min(1, "Please enter the abstract title")
        .refine((val) => countWordsFromHTML(val) <= 20, "The abstract title must not exceed 20 words."),

    is_for_young_watoc: z.boolean(),

    presentation_type: z.enum(['oral', 'poster'], 'Opción no válida'),

    text: z.string()
        .refine((val) => countWordsFromHTML(val) <= 350, "Abstract must be at most 350 words")
        .refine((val) => countWordsFromHTML(val) > 99, "Abstract must be at least 100 words"),

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
        .optional(),

    references: z.string()
        .min(1, "Please provide the references")
        .refine((val) => countWordsFromHTML(val) > 0, "References are required")
        .refine((val) => countWordsFromHTML(val) <= 350, "References must be at most 150 words"),

    status: z.enum(ABSTRACT_STATUS).optional(),

    created_at: z.coerce.date().optional(),

    last_update: z.coerce.date().optional(),

    last_review_at: z.coerce.date().optional(),

    user: z.number().or(z.lazy(() => userSchema.partial())).optional(),

    plain_title: z.string().optional(),

})


export const validateAuthorsSchema = abstractSchema.pick({ authors: true })

const abstractDTO = abstractSchema.omit({ user: true }).extend({
    user: z.object({
        id: z.number()
            .optional(),
        full_name: z.string().trim()
            .max(310, "Input too long")
            .optional(),
        email: z.email('Please provide a valid email address')
            .max(100, 'Input too long'),
    }),
})

export type AbstractDTO = z.infer<typeof abstractDTO>



export type AbstractSchema = z.infer<typeof abstractSchema>

export type AuthorSchema = z.infer<typeof authorSchema>
