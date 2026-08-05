import {
    countryCodes,
    userPrefixes,
    userRoles
} from "@/domain/constants";
import z from "zod";


const editUserFormSchema = z.object({
    id: z.number().optional(),
    firstName: z.string()
        .min(1, "Required")
        .max(100, "Input too long"),
    middleName: z.string()
        .max(100, "Input too long"),
    lastName: z.string()
        .min(1, "Required")
        .max(100, "Input too long"),
    email: z.email('Please provide a valid email address')
        .min(1, "Required")
        .max(100, "Input too long"),
    prefix: z.enum(userPrefixes.map(p => p.value), 'Choose a valid option'),
    roles: z.array(z.enum(userRoles.map(r => r.value), 'Choose a valid option'))
        .min(1, 'Choose at least one'),
    is_active: z.boolean(),
    email_verified: z.boolean(),
    nationality: z.enum(countryCodes, 'Choose a valid option'),
    city: z.string().trim()
        .min(1, "Required")
        .max(30, 'Input too long'),
    photo_file: z.instanceof(File)
        .nullable()
        .optional(),
    photo: z.string()
        .optional(),
    delete_photo: z.boolean(),
})


type EditUserFormValues = z.infer<typeof editUserFormSchema>

export {
    editUserFormSchema, type EditUserFormValues
};

