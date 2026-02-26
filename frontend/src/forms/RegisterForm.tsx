import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod';
import { prefixes, registrationSchema } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KeySquare, Landmark, Lock, Send, User } from 'lucide-react';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import axiosClient from '@/clients/axiosClient';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';

type TitleProps = {
    icon: React.ElementType
    title: string
}

const Title = ({ icon: Icon, title }: TitleProps) => {
    return (
        <div className='flex items-center gap-3'>
            {Icon && (
                <Icon className='text-primary-foreground bg-primary rounded-full p-1 shrink-0 size-8' />
            )}
            <span className='text-xl font-semibold w-full border-b-3 border-b-primary pb-1'>{title}</span>
        </div>
    )
}

export default function RegisterForm() {
    const navigate = useNavigate()
    const {
        handleSubmit, reset, setValue, setError, clearErrors,
        control, formState: { isValid, isSubmitting }
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: registrationSchema.parse({}),
        reValidateMode: 'onChange',
        mode: 'onChange',
    })

    const onSubmit = handleSubmit(async (data) => {
        await new Promise(r => setTimeout(r, 1000))

        const affiliation = data.affiliation
        const job_title = data.job_title
        const field_of_study = data.field_of_study

        const payload = {
            ...data,
            email: data.email.value,
            password: data.password.value,
            participant: {
                affiliation,
                job_title,
                field_of_study,
            }
        }

        try {
            const res = await axiosClient.post('/users/', payload)
            if (import.meta.env.DEV) {
                console.log(res.data);
            }
            reset(registrationSchema.parse({}), {
                keepIsSubmitted: false,
                keepIsValid: false,
                keepValues: false,
            })
            navigate('/login', { replace: true })
        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error.response);
            }
        }
    })

    return (
        <form action="#" onSubmit={onSubmit}>
            <fieldset className='space-y-3' disabled={isSubmitting}>
                <h1 className='text-4xl font-semibold text-center'>Create your profile</h1>
                <p className='text-center'>Fill your data and you'll be directely logged in on your dashboard</p>

                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Personal Information' icon={User} />

                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>
                        <Controller
                            name="prefix"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-prefix"   >
                                            Prefix
                                        </FieldLabel>
                                    </FieldContent>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id="form-select-prefix"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-30"
                                        >
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {prefixes.map(p => (
                                                <SelectItem value={p} key={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="pronouns"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}   >Pronouns</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Pronouns"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5'>
                        <Controller
                            name="first_name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}   >First name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="First name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="middle_name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}   >Middle name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Middle name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="last_name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}   >Last name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Last name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 justify-start items-start'>
                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-nationality"   >
                                            Nationality
                                        </FieldLabel>
                                    </FieldContent>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id="form-select-nationality"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-30"
                                        >
                                            <SelectValue placeholder="Country..." />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {countries.map(c => (
                                                <SelectItem value={c.value as string} key={c.value}>
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        srcSet={`https://flagcdn.com/w40/${c.value.toString().toLowerCase()}.png 2x`}
                                                        src={`https://flagcdn.com/w20/${c.value.toString().toLowerCase()}.png`}
                                                        alt=""
                                                    />
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="city"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}   >City</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="City"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Affiliation information' icon={Landmark} />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <Controller
                            name="affiliation"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Affiliation</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    <FieldDescription>Name of your institution</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="job_title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    <FieldDescription>Your current position or role</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="field_of_study"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Field of study</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    <FieldDescription>The major or primary area of your degree.</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Account details' icon={KeySquare} />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-5'>
                        <Controller
                            name="email.value"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email <address></address></FieldLabel>
                                    <FieldDescription>This will be your login email</FieldDescription>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        type='email'
                                        placeholder="name@example.com"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email.confirm"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirm email</FieldLabel>
                                    <FieldDescription>Please re-enter your email</FieldDescription>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        placeholder="Re-type your email"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                        <Controller
                            name="password.value"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type='password'
                                            placeholder="**********"
                                        />
                                        <InputGroupAddon align="inline-start">
                                            <Lock />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>Please create a secure password</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    <PasswordStrengthMeter control={control} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="password.confirm"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type='password'
                                            placeholder="Re-type your password"
                                        />
                                        <InputGroupAddon align="inline-start">
                                            <Lock />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>Please re-enter your password</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-5 pb-5'>
                    <div className='flex justify-center gap-5'>
                        <HCaptcha
                            sitekey={
                                import.meta.env.DEV
                                    ? "10000000-ffff-ffff-ffff-000000000001"
                                    : "ad963da0-1c32-45a2-a4ae-409600422f34"
                            }
                            onVerify={(token) => {
                                setValue("captcha", token, { shouldValidate: true });
                                clearErrors("captcha");
                            }}
                            onExpire={() => {
                                setValue("captcha", "");
                                setError("captcha", { type: "manual", message: "El captcha expiró" });
                            }}
                        />
                    </div>
                </div>

                <div className='flex flex-col items-center gap-3 w-full'>
                    <Button type='submit' className='p-5 text-xl' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Send data-icon="inline-start" />
                        )}
                        Create account
                    </Button>
                </div>
            </fieldset>

            <Button type='button' variant='ghost' onClick={() => reset(debugData)} className='w-full'>Debug data</Button>
        </form>
    )
}


const debugData = {
    first_name: "Carlos",
    middle_name: "Antonio",
    last_name: "Sánchez",
    prefix: "Prof.",
    pronouns: "he/him",
    nationality: "MX",
    city: "Mérida",
    affiliation: "Autonomous University of Yucatan",
    job_title: "Senior Research Fellow",
    field_of_study: "Artificial Intelligence",
    email: {
        value: "c.sanchez@example.com",
        confirm: "c.sanchez@example.com"
    },
    password: {
        value: "PutaMadre123#",
        confirm: "PutaMadre123#"
    },
    captcha: '',
}