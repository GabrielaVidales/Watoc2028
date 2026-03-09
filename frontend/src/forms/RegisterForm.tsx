import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod';
import { prefixes, registrationSchema } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, } from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KeySquare, Lock, Send, User } from 'lucide-react';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import axiosClient from '@/clients/axiosClient';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

type TitleProps = {
    icon: React.ElementType
    title: string
}

const Title = ({ icon: Icon, title }: TitleProps) => {
    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-3'>
                {Icon && (
                    <div className="size-10 flex justify-center items-center shrink-0 rounded-full bg-primary-main">
                        <Icon className='text-primary-contrast size-6' />
                    </div>
                )}
                <div className='text-xl font-semibold w-full'>{title}</div>
            </div>
            {/* <div className='h-1 w-full mx-auto bg-primary-main rounded-full' /> */}
        </div>
    )
}

export default function RegisterForm() {
    const navigate = useNavigate()
    const { handleSubmit, reset, control, formState: { isValid, isSubmitting } } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: registrationSchema.parse({}),
        mode: 'onChange',
    })

    const onSubmit = handleSubmit(async (data) => {
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
    }, async (invalid) => {
        console.log(invalid);

    })

    return (
        <form action="#" onSubmit={onSubmit}>
            <fieldset className='space-y-3' disabled={isSubmitting}>
                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Personal Information' icon={User} />

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 justify-start items-start'>
                        <Controller
                            name="prefix"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-prefix">
                                            Prefix <span className="text-destructive">*</span>
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
                                        >
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {prefixes.map(p => (
                                                <SelectItem value={p.value} key={p.value}>{p.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="first_name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        First name <div className="text-destructive">*</div>
                                    </FieldLabel>
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
                            name="last_name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Last name <div className="text-destructive">*</div>
                                    </FieldLabel>
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

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 justify-start items-start'>
                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-nationality"   >
                                            Nationality <div className="text-destructive">*</div>
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
                                    <FieldLabel htmlFor={field.name}>
                                        City <div className="text-destructive">*</div>
                                    </FieldLabel>
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

                <Separator className='bg-input' />

                <div className='flex flex-col gap-5 py-5'>
                    <Controller
                        name="affiliation"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='col-span-full'>
                                <FieldLabel htmlFor={field.name}>
                                    Affiliation <div className="text-destructive">*</div>
                                </FieldLabel>
                                <FieldDescription>Name of your institution</FieldDescription>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="job_title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Job title <div className="text-destructive">*</div>
                                </FieldLabel>
                                <FieldDescription>Your current position or role</FieldDescription>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="field_of_study"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Field of study <div className="text-destructive">*</div>
                                </FieldLabel>
                                <FieldDescription>The major or primary area of your degree.</FieldDescription>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Account details' icon={KeySquare} />

                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-5'>
                        <Controller
                            name="email.value"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Email address <div className="text-destructive">*</div>
                                    </FieldLabel>
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
                                    <FieldLabel htmlFor={field.name}>
                                        Confirm email <div className="text-destructive">*</div>
                                    </FieldLabel>
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

                    <Separator className='bg-input my-3' />

                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-5'>
                        <Controller
                            name="password.value"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Password <div className="text-destructive">*</div>
                                    </FieldLabel>
                                    <FieldDescription>Create a secure password</FieldDescription>
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
                                    <PasswordStrengthMeter control={control} className='mt-2' />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password.confirm"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Confirm password <div className="text-destructive">*</div>
                                    </FieldLabel>
                                    <FieldDescription>Re-enter your password</FieldDescription>
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
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </div>


                <fieldset className='flex flex-col items-center gap-3 w-full'>
                    <Button type='submit' className='p-5 text-xl' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Send data-icon="inline-start" />
                        )}
                        Create account
                    </Button>
                </fieldset>
            </fieldset>
        </form>
    )
}
