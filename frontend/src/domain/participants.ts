import { getFileSize } from "@/lib/utils";
import z from "zod";

const fileSchema = z
    .instanceof(File)
    .nullable()
    .superRefine(
        (file, ctx) => {
            if (!file) return

            // Valid type
            const validType = file => [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp",
                "application/pdf",
            ].includes(file.type)
            if (!validType) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Invalid file type",
                    path: ['student_proof'],
                })
            }

            // Max size: 5 MiB
            const maxSize = 5_242_880
            if (file.size > maxSize) {
                ctx.addIssue({
                    code: 'custom',
                    message: `The file size (${getFileSize(file)} exceeds maximum of ${getFileSize(maxSize)}`,
                    path: ['student_proof'],
                })
            }
        }
    )


const participantSchema = z.object({
    user: z.number()
        .nullable()
        .optional(),
    city: z.string().trim()
        .max(100, "Institution name is too long"),
    country: z.string().trim()
        .max(100, "Institution name is too long"),
    job_title: z.string().trim()
        .max(100, "Position title is too long"),
    field_of_study: z.string().trim()
        .max(100, "Field name is too long"),
    needs_invitation_letter: z
        .boolean(),
    fee_plan: z
        .number()
        .optional(),
})


const participantApiSchema = participantSchema.extend({
    student_proof: z.url('Not a valid file'),
    invitation_letter: z.url('Not a valid file'),
})


const participantFormSchema = participantSchema.extend({
    student_proof: fileSchema,
    invitation_letter: fileSchema,
    fee_plan_id: z.number().optional(),
}).omit({
    fee_plan: true,
})


type ParticipantSchema = z.infer<typeof participantApiSchema>

type ParticipantFormSchema = z.infer<typeof participantFormSchema>

export {
    participantApiSchema,
    participantFormSchema,
    type ParticipantFormSchema,
    type ParticipantSchema
};

