import z from "zod";


const assignmentSchema = z.object({
    user: z.any().nullable(),
    abstract: z.any().nullable(),
    assigned_by: z.any().nullable(),
    is_active: z.boolean(),
    due_date: z.date().nullable(),
})
    .transform((data, ctx) => {
        if (!data.due_date){
          ctx.addIssue({
                code: "custom",
                message: "Invalid date",
                path: ["due_date"],
            });
        }

        if (!data.abstract || !data?.abstract.id) {
            ctx.addIssue({
                code: "custom",
                message: "Select a valid submission",
                path: ["abstract"],
            });
        }

        if (!data.user || !data?.user.id) {
            ctx.addIssue({
                code: "custom",
                message: "Select a valid user",
                path: ["user"],
            });
        }

        if (!data.assigned_by || !data?.assigned_by.id) {
            
            ctx.addIssue({
                code: "custom",
                message: "Select a valid user",
                path: ["assigned_by"],
            });
        }

        return {
            user_id: data.user?.id as number,
            abstract_id: data.abstract?.id as number,
            assigned_by_id: data.assigned_by?.id as number,
            is_active: data.is_active,
            due_date: data.due_date,
        }
    })

type AssignmentFormInput = z.input<typeof assignmentSchema>
type AssignmentFormOutput = z.output<typeof assignmentSchema>

export {
    assignmentSchema,
    type AssignmentFormInput,
    type AssignmentFormOutput,
}
