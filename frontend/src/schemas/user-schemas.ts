import z from "zod";
import countries from '@/data/countries-list.json'
import { abstractSchema } from "./abstract-schemas";


const countriesArray = countries.map(country => country.code)

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


export const userSchema = z.object({
    id: z.number()
        .optional()
        .default(-1),
    first_name: z.string().trim()
        .min(1, "Please enter your first name")
        .max(100, "Input too long")
        .default(''),
    middle_name: z.string().trim()
        .max(100, "Input too long")
        .default('')
        .optional(),
    full_name: z.string().trim()
        .max(310, "Input too long")
        .default('')
        .optional(),
    last_name: z.string().trim()
        .min(1, "Please enter your last name")
        .max(100, "Input too long")
        .default(''),
    email: z.email('Please provide a valid email address')
        .max(100, 'Input too long')
        .default(''),
    prefix: z.enum(prefixes.map(p => p.value), 'Choose a valid option')
        .default('Prof.'),
    pronouns: z.string().trim()
        .max(50, 'Too long')
        .optional()
        .default(''),
    nationality: z.enum(countriesArray, 'Choose a valid option')
        .default(''),
    city: z.string().trim()
        .min(1, "Please enter your city")
        .max(30, 'Input too long')
        .default(''),
    photo: z.union([z.instanceof(File), z.string()])
        .nullable()
        .optional(),
    roles: z.array(z.enum(UserRole))
        .default([]),
    date_joined: z.coerce.date()
        .optional(),
    last_login: z.coerce.date()
        .optional(),
})

export const participantSchema = z.object({
    affiliation: z.string().trim()
        .min(1, "Institución requerida")
        .max(100, 'Inut too long')
        .default(''),
    job_title: z.string().trim()
        .min(1, "Departamento requerido")
        .max(100, 'Inut too long')
        .default(''),
    field_of_study: z.string().trim()
        .min(1, "Departamento requerido")
        .max(100, 'Inut too long')
        .default(''),
    abstracts: z.array(abstractSchema)
        .default([])
})

export const reviewerSchema = z.object({
    assignedAbstracts: z.array(abstractSchema)
        .default([])
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
                .min(1, "Field required *")
                .max(100, 'Input too long')
        })
            .default({ value: '', confirm: '' })
            .refine(data => data.value === data.confirm, {
                error: "Passwords do not match",
                path: ["confirm"]
            }),
        // captcha: z.string()
        //     .min(1, "Field required *")
        //     .max(100, 'Input too long')
        //     .default('')
        //     .optional()
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

export const changePasswordSchema = registrationSchema.pick({
    password: true
}).extend({
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
        photo: true,
        roles: true,
        full_name: true,
    })

export type EditUserFormValues = z.infer<typeof editUserFormSchema>
