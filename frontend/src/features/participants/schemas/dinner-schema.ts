import { AppleIcon, BeanIcon, CircleEllipsisIcon, EggIcon, FishIcon, LeafIcon, MilkIcon, NutIcon, ShellIcon, UtensilsIcon, WheatIcon, } from 'lucide-react';
import z from "zod";

export const dietaryNeedsList = [
    { id: 'vegetarian', value: 'veget', label: 'Vegetarian', icon: LeafIcon, },
    { id: 'vegan', value: 'vegan', label: 'Vegan', icon: LeafIcon, },
    { id: 'gluten-free', value: 'glut', label: 'Gluten-free', icon: WheatIcon, },
    { id: 'halal', value: 'halal', label: 'Halal', icon: UtensilsIcon, },
    { id: 'kosher', value: 'kosher', label: 'Kosher', icon: UtensilsIcon, },
    { id: 'paleo', value: 'paleo', label: 'Paleo', icon: AppleIcon, },
    { id: 'pescatarian', value: 'fish', label: 'Pescatarian', icon: FishIcon, },
    { id: 'other', value: 'other', label: 'Other restrictions', icon: UtensilsIcon, },
] as const

export const foodAllergyList = [
    { id: 1, value: 'milk', label: 'Milk', icon: MilkIcon },
    { id: 2, value: 'eggs', label: 'Eggs', icon: EggIcon },
    { id: 3, value: 'fish', label: 'Fish', icon: FishIcon },
    { id: 4, value: 'crustacean', label: 'Crustacean', icon: ShellIcon },
    { id: 5, value: 'mollusk', label: 'Mollusk', icon: ShellIcon },
    { id: 6, value: 'almond', label: 'Almond', icon: NutIcon },
    { id: 7, value: 'hazelnut', label: 'Hazelnut', icon: NutIcon },
    { id: 8, value: 'walnut', label: 'Walnut', icon: NutIcon },
    { id: 9, value: 'peanuts', label: 'Peanuts', icon: NutIcon },
    { id: 10, value: 'wheat', label: 'Wheat (Gluten)', icon: WheatIcon },
    { id: 11, value: 'soybeans', label: 'Soybeans', icon: BeanIcon },
    { id: 12, value: 'other', label: 'Other', icon: CircleEllipsisIcon },
] as const

export const dinnerAssistanceSchema = z.object({
    willAssistDinner: z.boolean()
        .nonoptional(),

    hasDietaryRestriction: z.boolean()
        .optional(),

    dietaryNeeds: z.array(z.enum(dietaryNeedsList.map(x => x.value)))
        .optional()
        .refine((items) => items.every((item) => dietaryNeedsList.map(x => x.value).includes(item)), {
            message: "Invalid data",
        }),
    otherDietaryNeeds: z.string()
        .trim()
        .max(500, 'Input too long')
        .optional(),

    hasFoodAllergy: z.boolean()
        .optional(),

    foodAllergies: z.array(z.enum(foodAllergyList.map(x => x.value)))
        .optional()
        .refine((items) => items.every((item) => foodAllergyList.map(x => x.value).includes(item)), {
            message: "Invalid data",
        }),

    otherAllergies: z.string()
        .trim()
        .max(500, 'Input too long')
        .optional(),

})
    .refine(({ willAssistDinner, hasDietaryRestriction }) => !willAssistDinner || hasDietaryRestriction !== undefined,
        {
            error: "Please indicate if you have dietary restrictions",
            path: ['hasDietaryRestriction'],
        })
    .refine(({ willAssistDinner, hasFoodAllergy }) => !willAssistDinner || hasFoodAllergy !== undefined,
        {
            error: "Please indicate if you have food allergies",
            path: ['hasFoodAllergy'],
        })

    .refine(data => !data.hasDietaryRestriction || data.dietaryNeeds.length > 0,
        {
            error: "Select at least one dietary need",
            path: ['dietaryNeeds'],
        })
    .refine(data => !data.hasFoodAllergy || data.foodAllergies.length > 0,
        {
            error: "Select at least one allergy",
            path: ['foodAllergies'],
        })

    .refine(({ dietaryNeeds, otherDietaryNeeds }) => !(dietaryNeeds.includes('other') && !otherDietaryNeeds),
        {
            error: "Please specify your other dietary needs",
            path: ['otherDietaryNeeds'],
        })
    .refine(({ foodAllergies, otherAllergies }) => !(foodAllergies.includes('other') && !otherAllergies),
        {
            error: "Please specify your other allergies",
            path: ['otherAllergies'],
        })


export type DietaryRestrictionsFormValues = z.infer<typeof dinnerAssistanceSchema>