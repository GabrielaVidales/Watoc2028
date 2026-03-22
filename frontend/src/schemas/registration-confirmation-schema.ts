import z from "zod";
import { dinnerAssistanceSchema } from "./dinner- schema";
import { selectTourSchema } from "./select-tour-schema";
import { selectFeeSchema } from "./select-fee-schema";

export const congressRegistrationSchema = z.object({
    fee: selectFeeSchema,
    dinner: dinnerAssistanceSchema,
    tour: selectTourSchema,
})

export type CongressRegistrationValues = z.infer<typeof congressRegistrationSchema>