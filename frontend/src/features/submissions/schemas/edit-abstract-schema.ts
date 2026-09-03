import { countWordsFromHTML } from "@/components/EnrichedTextArea";
import z from "zod";
import type { AbstractSchema } from "./abstract-schemas";


const presentationValues = [
    'oral',
    'poster',
    'youngWatoc'
] as const


const editAbstractSchema = z.object({
    id: z.number(),

    title: z.string()
        .min(1, "Please enter the abstract title")
        .refine((val) => countWordsFromHTML(val) <= 20, "The abstract title must not exceed 20 words."),

    presentation_type: z
        .enum(presentationValues, 'Opción no válida')
        .or(z.literal(''))
        .optional()
        .transform(value => value === '' ? undefined : value),

    text: z.string()
        .refine((val) => countWordsFromHTML(val) <= 350, "Abstract must be at most 350 words")
        .refine((val) => countWordsFromHTML(val) > 99, "Abstract must be at least 100 words"),

    references: z.string()
        .min(1, "Please provide the references")
        .refine((val) => countWordsFromHTML(val) <= 150, "References must be at most 150 words"),

})
    .superRefine((data, ctx) => {
        if (!data.presentation_type) {
            ctx.addIssue({
                code: 'custom',
                message: 'Choose a valid presentation format',
                path: ['presentation_type'],
            })
        }
    })
    .transform(data => {
        const youngWatoc = data.presentation_type === 'youngWatoc'
        const presentationType = youngWatoc ? '' : data.presentation_type as 'oral' | 'poster'

        const abstract: AbstractSchema = {
            title: data.title,
            is_for_young_watoc: youngWatoc,
            presentation_type: presentationType,
            references: data.references,
            text: data.text,
            id: data.id
        }

        return abstract
    })


type EditAbstractFormValues = z.input<typeof editAbstractSchema>


export {
    editAbstractSchema,
    type EditAbstractFormValues
};

