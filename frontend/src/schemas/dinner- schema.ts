import { data } from "react-router";
import z from "zod";

export const dietaryNeedsList = [
    { value: 'veget', label: 'Vegetarian', },
    { value: 'vegan', label: 'Vegan', },
    { value: 'glut', label: 'Gluten-free', },
    { value: 'halal', label: 'Halal', },
    { value: 'kosher', label: 'Kosher', },
    { value: 'paleo', label: 'Paleo', },
    { value: 'fish', label: 'Pescatarian', },
    { value: 'other', label: 'Other restrictions', },
] as const

export const foodAllergyList = [
    { value: 'milk', label: 'Milk' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'fish', label: 'Fish' },
    { value: 'crustacean', label: 'Crustacean' },
    { value: 'mollusk', label: 'Mollusk' },
    { value: 'almond', label: 'Almond' },
    { value: 'hazelnut', label: 'Hazelnut' },
    { value: 'walnut', label: 'Walnut' },
    { value: 'peanuts', label: 'Peanuts' },
    { value: 'wheat', label: 'Wheat (Gluten)' },
    { value: 'soybeans', label: 'Soybeans' },
    { value: 'other', label: 'Other' },
] as const;

export const dietaryRestrictionsForm = z.object({
    willAssistDinner: z.boolean()
        .nonoptional(),

    hasDietaryRestriction: z.boolean()
        .optional(),

    dietaryNeeds: z.array(z.enum(dietaryNeedsList.map(x => x.value)))
        .default([])
        .optional()
        .refine((items) => items.every((item) => dietaryNeedsList.map(x => x.value).includes(item)), {
            message: "Invalid data",
        }),
    otherDietaryNeeds: z.string()
        .trim()
        .max(75, 'Input too long')
        .default('')
        .optional(),

    hasFoodAllergy: z.boolean()
        .optional(),

    foodAllergies: z.array(z.enum(foodAllergyList.map(x => x.value)))
        .default([])
        .optional()
        .refine((items) => items.every((item) => foodAllergyList.map(x => x.value).includes(item)), {
            message: "Invalid data",
        }),

    otherAllergies: z.string()
        .trim()
        .max(100, 'Input too long')
        .default('')
        .optional(),

})
    .refine(({ willAssistDinner, hasDietaryRestriction }) => !willAssistDinner || hasDietaryRestriction !== undefined,
        { error: "Please indicate if you have dietary restrictions", path: ['hasDietaryRestriction'], })
    .refine(({ willAssistDinner, hasFoodAllergy }) => !willAssistDinner || hasFoodAllergy !== undefined,
        { error: "Please indicate if you have food allergies", path: ['hasFoodAllergy'], })

    .refine(data => !data.hasDietaryRestriction || data.dietaryNeeds.length > 0,
        { error: "Select at least one dietary need", path: ['dietaryNeeds'], })
    .refine(data => !data.hasFoodAllergy || data.foodAllergies.length > 0, 
        { error: "Select at least one allergy", path: ['foodAllergies'], })

    .refine(({ dietaryNeeds, otherDietaryNeeds }) => !(dietaryNeeds.includes('other') && !otherDietaryNeeds),
        { error: "Please specify your other dietary needs", path: ['otherDietaryNeeds'], })
    .refine(({ foodAllergies, otherAllergies }) => !(foodAllergies.includes('other') && !otherAllergies),
        { error: "Please specify your other allergies", path: ['otherAllergies'], })



export type DietaryRestrictionsFormValues = z.infer<typeof dietaryRestrictionsForm>