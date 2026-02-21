import z from "zod";
import countries from '@/data/countries-list.json'

const countriesArray = countries.map(country => country.code)

export const prefixes = [
    "Sr.",
    "Sra.",
    "Srta.",
    "Dr.",
    "Dra.",
    "Mtro.",
    "Mtra.",
    "Prof.",
]

export const userSchema = z.object({
    first_name: z.string().min(1, "Please enter your first name").max(100, "Input too long"),
    middle_name: z.string().max(100, "Input too long").optional(),
    last_name: z.string().min(1, "Please enter your last name").max(100, "Input too long"),
    email: z.email('Please provide a valid email address').max(100, 'Input too long'),
    prefix: z.enum(prefixes, 'Choose a valid option'),
    pronouns: z.string().max(50, 'Too long').optional(),
    nationality: z.enum(countriesArray, 'Choose a valid option'),
    city: z.string().min(1, "Please enter your city").max(30, 'Input too long'),
    photo: z.instanceof(File).nullable().optional(),
})

export const participantSchema = z.object({
    affiliation: z.string().min(1, "Institución requerida").max(100, 'Inut too long'),
    job_title: z.string().min(1, "Departamento requerido").max(100, 'Inut too long'),
    field_of_study: z.string().min(1, "Departamento requerido").max(100, 'Inut too long'),
})


export const registrationSchema = userSchema.omit({
    email: true
})
    .extend(participantSchema.shape)
    .extend({
        email: z.object({
            value: z.email("Invalid email address")
                .min(1, 'Field required *'),
            confirm: z.string()
        }).refine(data => data.value === data.confirm, {
            error: 'Los correos no coinciden',
            path: ['confirm']
        }),
        password: z.object({
            value: z.string()
                .min(8, "Minimum 8 characters")
                .regex(/[A-Z]/, "Must contain at least one uppercase letter")
                .regex(/[a-z]/, "Must contain at least one lowercase letter")
                .regex(/[0-9]/, "Must contain at least one digit")
                .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
            confirm: z.string()
                .min(1, "Field required *")
        }).refine(data => data.value === data.confirm, {
            error: "Passwords do not match",
            path: ["confirm"]
        }),
    })

export type RegistrationFormValues = z.infer<typeof registrationSchema>

