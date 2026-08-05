import { countryCodes, userPrefixes } from "@/domain/constants";
import z from "zod";


const emailConfirmation = z.object({
    value: z.email("Invalid email address")
        .min(1, 'Field required *')
        .max(100, 'Input too long'),
    confirm: z.string()
        .min(1, "You must confirm your email *")
        .max(100, 'Input too long'),
}).refine(data => data.value === data.confirm, {
    error: 'Email does not match',
    path: ['confirm']
})


const passwordConfirmation = z.object({
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
}).refine(data => data.value === data.confirm, {
    error: "Passwords do not match",
    path: ["confirm"]
})


export const registrationSchema = z.object({
    prefix: z.enum(userPrefixes.map(p => p.value), 'Choose a valid option'),
    first_name: z.string().trim()
        .min(1, "Please enter your first name")
        .max(100, "Input too long"),
    middle_name: z.string().trim()
        .max(100, "Input too long")
        .optional(),
    last_name: z.string().trim()
        .min(1, "Please enter your last name")
        .max(100, "Input too long"),
    pronouns: z.string().trim()
        .max(50, 'Too long')
        .optional(),
    nationality: z.enum(countryCodes, 'Choose a valid option'),
    city: z.string().trim()
        .min(1, "Please enter your city")
        .max(30, 'Input too long'),

    affiliation: z.string().trim()
        .min(1, "Affiliation is required")
        .max(100, "Institution name is too long"),
    job_title: z.string().trim()
        .min(1, "Position or Job Title is required")
        .max(100, "Position title is too long"),
    field_of_study: z.string().trim()
        .min(1, "Field of study is required")
        .max(100, "Field name is too long"),

    email: emailConfirmation,

    password: passwordConfirmation,
})
    .transform(data => {
        const { email, password, affiliation, job_title, field_of_study, ...rest } = data;
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


export type RegisterFormInputValues = z.input<typeof registrationSchema>
export type RegisterFormOutputValues = z.output<typeof registrationSchema>