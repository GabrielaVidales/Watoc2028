import z from "zod";
import countries from '@/data/countries-list.json'
import { countWordsFromHTML } from "@/components/EnrichedTextArea";

const countriesArray = countries.map(country => country.code)

export const affiliationSchema = z.object({
    id: z.number()
        .optional(),
    institution: z.string().trim()
        .min(1, 'Required')
        .max(100, 'Input too long')
        .default(''),
    country: z.enum(countriesArray, 'Choose a valid option')
        .default(''),
    city: z.string().trim()
        .min(1, "Please enter your city")
        .max(30, 'Input too long')
        .default(''),
})

export type Affiliation = z.infer<typeof affiliationSchema>
