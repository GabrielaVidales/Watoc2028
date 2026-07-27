import z, { object } from "zod";
import { affiliationSchema } from "./affiliation-schema";
import { userSchema } from "../user-schemas";


export const authorSchema = object({
    id: z.number()
    .nullable(),
    first_name: z.string()
        .min(1, "Required")
        .max(60, 'Input too long'),
    last_name: z.string()
        .min(1, "Required")
        .max(60, 'Input too long'),
    order: z.number()
        .optional(),
    email: z.email('Invalid email')
        .max(100, 'Input too long'),
    is_corresponding_author: z.boolean(),
    affiliation_id: z.number().nullable(),
    related_user_id: z.number().nullable(),
})


export const authorFormSchema = authorSchema.extend(affiliationSchema.omit({ id: true }).shape)

export const authorAPISchema = authorSchema.extend({
    // La API devuelve este property
    abstract_id: z.number().nullable(),
    affiliation: affiliationSchema.optional(),
    related_user: userSchema.optional(),
})


type Author = z.infer<typeof authorSchema>

type AuthorSchema = z.infer<typeof authorAPISchema>

type AuthorFormSchema = z.infer<typeof authorFormSchema>

export type {
    Author,
    AuthorSchema,
    AuthorFormSchema
}