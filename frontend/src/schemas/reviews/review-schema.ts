import { countWordsBelowLimit } from "@/lib/utils";
import z from "zod";


const status = [
    "pending",
    "accepted",
    "declined",
    "completed",
    "cancelled"
]

export const reviewSchema = z.object({
    id: z.number().optional(),
    assignment_id: z.number().optional(),
    submitted_at: z.number().optional(),
    status: z.enum(status, 'Invalid status'),
    comments: z.string().min(1, 'Required').refine(val => countWordsBelowLimit(val, 1000)),
    suggestions: z.string().min(1, 'Required').refine(val => countWordsBelowLimit(val, 1002)),
})


export type ReviewSchema = z.infer<typeof reviewSchema>