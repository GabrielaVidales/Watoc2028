import { countWordsFromHTML } from "@/components/EnrichedTextArea";
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
] as const

export const ABSTRACT_STATUS = [
    "draft",
    "submitted",
    "accepted",
    "rejected",
    "corrections",
    "deleted"
] as const;


const editAbstractSchema = z.object({
    id: z.number(),
    title: z.string()
        .min(1, "Please enter the abstract title")
        .refine((val) => countWordsFromHTML(val) <= 10, "The abstract title must not exceed 10 words."),
    presentation_type: z.enum(presentationTypes.map(v => v.value), 'Opción no válida'),
    text: z.string()
        .refine((val) => countWordsFromHTML(val) <= 350, "Abstract must be at most 350 words")
        .refine((val) => countWordsFromHTML(val) > 99, "Abstract must be at least 100 words"),
    references: z.string()
        .min(1, "Please provide the references")
        .refine((val) => countWordsFromHTML(val) <= 150, "References must be at most 150 words"),
})

type EditAbstractFormValues = z.infer<typeof editAbstractSchema>


export {
    editAbstractSchema,
    type EditAbstractFormValues,
}