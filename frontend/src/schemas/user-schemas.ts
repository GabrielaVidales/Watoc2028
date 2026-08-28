import { countryCodes, userPrefixValues, userRoleValues } from "@/domain/constants";
import z from "zod";
import { abstractSchema } from "./abstracts/abstract-schemas";


export const participantSchema = z.object({
    affiliation: z.string().trim()
        .min(1, "Affiliation is required")
        .max(100, "Institution name is too long"),
    job_title: z.string().trim()
        .min(1, "Position or Job Title is required")
        .max(100, "Position title is too long"),
    field_of_study: z.string().trim()
        .min(1, "Field of study is required")
        .max(100, "Field name is too long"),
    abstracts: z.array(abstractSchema)
})

export const reviewerSchema = z.object({
    assignedAbstracts: z.array(abstractSchema)
})


export const userSchema = z.object({
    id: z.number()
        .optional(),
    email_verified: z.boolean()
        .optional(),
    is_active: z.boolean()
        .optional(),

    first_name: z.string().trim()
        .min(1, "Required")
        .max(100, "Input too long"),
    middle_name: z.string().trim()
        .max(100, "Input too long")
        .optional(),
    last_name: z.string().trim()
        .min(1, "Required")
        .max(100, "Input too long"),
    full_name: z.string().trim()
        .optional(),

    email: z.email('Invalid email address')
        .max(100, 'Input too long'),

    prefix: z.enum(userPrefixValues, 'Choose a valid option'),

    pronouns: z.string().trim()
        .max(50, 'Too long')
        .optional(),

    institution: z.string().trim()
        .min(1, "Required")
        .max(100, "Institution name is too long"),
    job_title: z.string().trim()
        .min(1, "Required")
        .max(100, "Position title is too long"),
    field_of_study: z.string().trim()
        .min(1, "Required")
        .max(100, "Field name is too long"),

    nationality: z.enum(countryCodes, 'Invalid option'),

    city: z.string().trim()
        .min(1, "Required")
        .max(30, 'Input too long'),
    photo: z.url()
        .nullable()
        .optional(),
    photo_filename: z.string()
        .optional(),

    roles: z.array(z.enum(userRoleValues, 'Invalid value')),

    date_joined: z.coerce.date()
        .optional(),
    last_login: z.coerce.date()
        .optional(),

    // participant: participantSchema
    //     .optional()
})


export type UserSchema = z.infer<typeof userSchema>

export type ParticipantSchema = z.infer<typeof participantSchema>

export type ReviewerSchema = z.infer<typeof reviewerSchema>


export const profilePicSchema = z.object({
    photo: z.instanceof(File, { error: 'Please upload an valid image' })
})

export const changePasswordSchema = z.object({
    password: z.object({
        value: z.string()
            .min(8, "Minimum 8 characters")
            .max(100, 'Input too long')
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one digit")
            .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
        confirm: z.string()
            .min(1, "Field required *")
            .max(100, 'Input too long')
    })
        .refine(data => data.value === data.confirm, {
            error: "Passwords do not match",
            path: ["confirm"]
        }),
    oldPassword: z.string()
        .min(1, 'Password required')
        .max(100, 'Input too long')
})

export const editUserFormSchema = userSchema
    .extend({
        photo: z.instanceof(File, {
            error: 'Invalid file',
        })
            .nullable(),
        email: z.object({
            value: z.email("Invalid email address")
                .max(100, 'Input too long')
                .or(z.literal(''))
                .optional(),
            confirm: z.string()
                .max(100, 'Input too long'),
        })
            .refine(data => !data.confirm || data.value === data.confirm, {
                error: 'Email does not match',
                path: ['confirm']
            }),
    })
    .omit({
        email_verified: true,
        is_active: true,
        photo_filename: true,
        // participant: true,
        last_login: true,
        date_joined: true,
        full_name: true,
        roles: true,
    })
    .transform((data) => {


        return {
            ...data,
           email: data.email.value,
        }
    })


export type UserRole = 'admin' | 'reviewer' | 'participant';

export type EditUserFormValues = z.input<typeof editUserFormSchema>
export type EditUserFormOutput = z.output<typeof editUserFormSchema>

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
