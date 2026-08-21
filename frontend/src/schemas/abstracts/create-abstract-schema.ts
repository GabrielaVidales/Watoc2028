import { countWordsFromHTML } from "@/components/EnrichedTextArea";
import z from "zod";

const createAbstractSchema = z.object({
    title: z.string()
        .min(1, 'Required')
        .refine(
            value => countWordsFromHTML(value) <= 20,
            "The abstract title must not exceed 20 words."
        )
})

type CreateAbstractFormValues = z.infer<typeof createAbstractSchema>

export {
    createAbstractSchema,
    type CreateAbstractFormValues
};

