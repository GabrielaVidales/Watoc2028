import z from "zod";

export const selectFeeSchema = z.object({
    plan: z.enum(['regular', 'student'] as const),

    studentProof: z.instanceof(File)
        .optional(),
    invitationLetter: z.boolean('Please select an option.')
        .optional(),
})
    .refine(obj => obj.plan === 'regular' || Boolean(obj.studentProof), {
        error: 'Student proof is required for selected fee.',
        path: ['studentProof']
    });

export type SelectFeeValues = z.infer<typeof selectFeeSchema>;
