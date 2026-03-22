import z from "zod";


export const selectTourSchema = z.object({
    willAssistTour: z.boolean(),
    selectedTours: z.array(z.number())
})
    .refine((obj) => !obj.willAssistTour || obj.selectedTours.length > 0, {
        error: 'Select at least 1 tour.',
        path: ['selectedTours']
    });

export type SelectTourValues = z.infer<typeof selectTourSchema>;
