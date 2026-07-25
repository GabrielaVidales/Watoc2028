import { countries } from "@/utils/countriesInfo";
import z from "zod";
import { abstractSchema } from "./abstracts/abstract-schemas";


const countriesArray = countries.map(country => country.value)

export const prefixes = [
    { value: "Miss", label: "Miss" },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Mr.", label: "Mr." },
    { value: "Dr.", label: "Dr." },
    { value: "Prof.", label: "Prof." },
    { value: "Mx.", label: "Mx." },
] as const;

export const UserRole = {
    Admin: 'admin',
    Reviewer: 'reviewer',
    Participant: 'participant',
} as const;


export type UserRole = (typeof UserRole)[keyof typeof UserRole];


export const participantSchema = z.object({
    affiliation: z.string().trim()
        .min(1, "Affiliation is required")
        .max(100, "Institution name is too long")
        .default(''),
    job_title: z.string().trim()
        .min(1, "Position or Job Title is required")
        .max(100, "Position title is too long")
        .default(''),
    field_of_study: z.string().trim()
        .min(1, "Field of study is required")
        .max(100, "Field name is too long")
        .default(''),
    abstracts: z.array(abstractSchema)
        .default([])
})

export const reviewerSchema = z.object({
    assignedAbstracts: z.array(abstractSchema)
        .default([])
})

export const userSchema = z.object({
    id: z.number()
        .optional(),
    first_name: z.string().trim()
        .min(1, "Please enter your first name")
        .max(100, "Input too long"),
    middle_name: z.string().trim()
        .max(100, "Input too long")
        .optional(),
    full_name: z.string().trim()
        .max(310, "Input too long")
        .optional(),
    last_name: z.string().trim()
        .min(1, "Please enter your last name")
        .max(100, "Input too long"),
    email: z.email('Please provide a valid email address')
        .max(100, 'Input too long'),

    is_active: z.boolean()
        .optional(),
    email_verified: z.boolean()
        .optional(),

    prefix: z.enum(prefixes.map(p => p.value), 'Choose a valid option'),
    pronouns: z.string().trim()
        .max(50, 'Too long')
        .optional(),
    nationality: z.enum(countriesArray, 'Choose a valid option'),
    city: z.string().trim()
        .min(1, "Please enter your city")
        .max(30, 'Input too long'),
    photo: z.union([z.instanceof(File), z.string()])
        .nullable()
        .optional(),
    roles: z.array(z.enum(UserRole)),
    date_joined: z.coerce.date()
        .optional(),
    last_login: z.coerce.date()
        .optional(),

    participant: participantSchema
        .optional()
})


export type UserSchema = z.infer<typeof userSchema>

export type ParticipantSchema = z.infer<typeof participantSchema>

export type ReviewerSchema = z.infer<typeof reviewerSchema>


// Formularios
export const registrationSchema = userSchema
    .extend(participantSchema.shape)
    .omit({
        id: true,
        email: true,
        photo: true,
        roles: true,
        abstracts: true,
        full_name: true,
        date_joined: true,
        last_login: true,
    })
    .extend({
        email: z.object({
            value: z.email("Invalid email address")
                .min(1, 'Field required *')
                .max(100, 'Input too long'),
            confirm: z.string()
                .min(1, "You must confirm your email *")
                .max(100, 'Input too long'),
        })
            .default({ value: '', confirm: '' })
            .refine(data => data.value === data.confirm, {
                error: 'Email does not match',
                path: ['confirm']
            }),

        password: z.object({
            value: z.string()
                .min(8, "Minimum 8 characters")
                .max(100, 'Input too long')
                .regex(/[A-Z]/, "Must contain at least one uppercase letter")
                .regex(/[a-z]/, "Must contain at least one lowercase letter")
                .regex(/[0-9]/, "Must contain at least one digit")
                .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
            confirm: z.string()
                .min(1, "You must confirm your password *")
                .max(100, 'Input too long')
        })
            .default({ value: '', confirm: '' })
            .refine(data => data.value === data.confirm, {
                error: "Passwords do not match",
                path: ["confirm"]
            }),
    })
    .transform(value => {
        const { email, password, affiliation, job_title, field_of_study, ...rest } = value;
        return {
            ...rest,
            email: email.value,
            password: password.value,
            participant: {
                affiliation,
                job_title,
                field_of_study,
            }
        }
    })


export const loginSchema = z.object({
    email: z.email('Please provide a valid email address')
        .min(1, 'Email required')
        .max(100, 'Input too long')
        .default(''),
    password: z.string()
        .min(1, 'Password required')
        .max(100, 'Input too long')
        .default('')
})


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
        .default({ value: '', confirm: '' })
        .refine(data => data.value === data.confirm, {
            error: "Passwords do not match",
            path: ["confirm"]
        }),
    oldPassword: z.string()
        .min(1, 'Password required')
        .max(100, 'Input too long')
        .default('')
})

export const editUserFormSchema = userSchema
    .extend({
        participant: participantSchema.omit({
            abstracts: true
        }),
        email: z.object({
            value: z.email("Invalid email address")
                .max(100, 'Input too long')
                .or(z.literal(''))
                .optional(),
            confirm: z.string()
                .max(100, 'Input too long'),
        })
            .default({ value: '', confirm: '' })
            .refine(data => !data.confirm || data.value === data.confirm, {
                error: 'Email does not match',
                path: ['confirm']
            }),
    })
    .omit({
        last_login: true,
        date_joined: true,
        // photo: true,
        roles: true,
        full_name: true,
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registrationSchema>
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
