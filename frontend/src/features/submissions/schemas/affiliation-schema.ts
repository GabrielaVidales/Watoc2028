import { countries } from "@/utils/countriesInfo";
import z from "zod";

const countriesArray = countries.map(country => country.value)

export const affiliationSchema = z.object({
    id: z.number()
        .optional(),
    institution: z.string().trim()
        .min(1, 'Required')
        .max(100, 'Input too long'),
    country: z.enum(countriesArray, 'Choose a valid option'),
    city: z.string().trim()
        .min(1, "Required")
        .max(30, 'Input too long'),
})

export type Affiliation = z.infer<typeof affiliationSchema>
