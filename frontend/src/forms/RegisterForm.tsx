import api from '@/clients/api';
import { notify } from '@/components/custom/notify';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, } from "@/components/ui/field";
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { userPrefixes } from '@/domain/constants';
import { DEBUG } from '@/lib/constants';
import { routes } from '@/routes/routes';
import type { UserSchema } from '@/schemas/user-schemas';
import { registrationSchema, type RegisterFormInputValues, type RegisterFormOutputValues } from '@/schemas/users/registration-schema';
import { countries } from '@/utils/countriesInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, KeyRoundIcon, KeySquare, Lock, LockOpenIcon, Send, UserSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';


const defaultValues = DEBUG ? {
    password: {
        value: 'Password123#',
        confirm: 'Password123#',
    },
    nationality: 'MX',
    city: 'asdsada',
    email: {
        confirm: 'asdasd@sadsa.sd',
        value: 'asdasd@sadsa.sd',
    },
    institution: 'asdasd@sadsa.sd',
    field_of_study: 'asdasd@sadsa.sd',
    job_title: 'asdasd@sadsa.sd',
    first_name: 'sadsads',
    middle_name: 'adsads',
    last_name: 'asdasd',
    pronouns: 'asdas',
} : {
    password: {
        value: '',
        confirm: '',
    },
    nationality: '',
    city: '',
    email: {
        confirm: '',
        value: '',
    },
    affiliation: '',
    field_of_study: '',
    job_title: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    pronouns: '',
}

export default function RegisterForm() {
    const navigate = useNavigate()

    const {
        handleSubmit,
        setError,
        clearErrors,
        trigger,
        control, formState: {
            isValid,
            isSubmitting,
            errors,
            isDirty,
        }
    } = useForm<RegisterFormInputValues, any, RegisterFormOutputValues>({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange',
        defaultValues,
    })

    const post = useMutation({
        mutationFn: async (data: RegisterFormOutputValues) => await api.post<UserSchema>('/users/', data),
        onSuccess: ({ data }) => {
            navigate(routes.auth.login, { replace: true })
            notify.success('Verify your email address', {
                description: (
                    <span>
                        We've sent a new verification link to your email address{" "}
                        <span className='font-bold'>{data.email}</span>.{" "}
                        Please check your inbox and spam folder.
                    </span>
                )
            })
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                if (DEBUG) {
                    console.log(errors);
                }
                const serverErrors = error.response.data
                Object.keys(serverErrors).forEach((key) => {
                    const fieldName = key as keyof RegisterFormInputValues
                    const errorValue = serverErrors[fieldName]
                    const schemaName = (fieldName === 'email') ?
                        'email.value' : (fieldName === 'password') ?
                            'password.value' : fieldName
                    setError(schemaName, {
                        type: "server",
                        message: errorValue
                    }, {
                        shouldFocus: true
                    })

                    notify.destructive('Something went wrong!', {
                        description: errorValue,
                    })
                })

            } else {
                notify.destructive('Something went wrong!', {
                    description: 'Connection failed. Please try again later.',
                })
            }
        },
    })

    const onFormSubmit = handleSubmit(async (data) => {
        await post.mutateAsync(data)
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleVisibility = (f: typeof setShowPassword) => f((show) => !show);

    const countryItems = useMemo(() => countries.map(c => (
        <SelectItem value={c.value as string} key={c.value}>
            <img loading="lazy" width="20"
                src={`https://flagcdn.com/w20/${c.value.toString().toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${c.value.toString().toLowerCase()}.png 2x`}
                alt="" />
            {c.label}
        </SelectItem>
    )), [countries])

    return (
        <form id='registration-form' onSubmit={onFormSubmit} onInput={() => clearErrors('root')}>
            <fieldset className='space-y-5' disabled={isSubmitting}>
                <div className='flex flex-col gap-5'>
                    <div className="flex gap-3 items-center">
                        <UserSquare className='text-primary-main' />
                        <h2 className='text-xl font-semibold'>Personal Information</h2>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 justify-start items-start'>
                        <Controller
                            name="prefix"
                            control={control}
                            defaultValue='Mr.'
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
                                            {userPrefixes.map(p => (
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
                            defaultValue=''
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
                            name="middle_name"
                            control={control}
                            defaultValue=''
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Middle name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Midle name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="last_name"
                            control={control}
                            defaultValue=''
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
                            defaultValue=''
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
                                            {countryItems}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="city"
                            control={control}
                            defaultValue=''
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

                <Separator />

                <div className='flex flex-col gap-5'>
                    <Controller
                        name="institution"
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='col-span-full'>
                                <FieldLabel htmlFor={field.name}>
                                    Institution <div className="text-destructive">*</div>
                                </FieldLabel>
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
                            <Field data-invalid={fieldState.invalid} className='w-full'>
                                <FieldLabel htmlFor={field.name}>Job Title</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FieldError errors={[fieldState.error]} />
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                        )}
                    />
                    <Controller
                        name="field_of_study"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='w-full'>
                                <FieldLabel htmlFor={field.name}>Field of study</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FieldError errors={[fieldState.error]} />
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 py-5'>
                    <div className="flex gap-3 items-center">
                        <KeySquare className='text-primary-main' />
                        <h2 className='text-xl font-semibold'>Account details</h2>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-5'>
                        <Controller
                            name="email.value"
                            control={control}
                            defaultValue=''
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Email address <div className="text-destructive">*</div>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        onInput={() => queueMicrotask(async () => {
                                            await trigger('email.confirm')
                                        })}
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
                            defaultValue=''
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
                                        onInput={() => queueMicrotask(async () => {
                                            await trigger('email.value')
                                        })}
                                        autoComplete="off"
                                        placeholder="Re-type your email"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <Separator />

                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-1'>
                        <Controller
                            name="password.value"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••••••"
                                            maxLength={65}
                                            onChange={async (e) => {
                                                field.onChange(e)
                                                await trigger('password.confirm')
                                            }}
                                        />
                                        <InputGroupAddon align="inline-start">
                                            {!isDirty || fieldState.invalid ? <LockOpenIcon /> : <Lock className='text-primary-light' />}
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                title='Show password'
                                                size='icon-xs'
                                                onClick={() => toggleVisibility(setShowPassword)}
                                            >
                                                {showPassword ?
                                                    <EyeOff className='shrink-0 size-5' /> :
                                                    <Eye className='shrink-0 size-5' />
                                                }
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className='h-6'>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                        <Controller
                            name="password.confirm"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Re-type your new password"
                                            maxLength={65}
                                            onChange={async (e) => {
                                                field.onChange(e)
                                                await trigger('password.value')
                                            }}
                                        />
                                        <InputGroupAddon align="inline-start">
                                            {!isDirty || fieldState.invalid ? <LockOpenIcon /> : <Lock className='text-primary-light' />}
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                title='Show password'
                                                size='icon-xs'
                                                onClick={() => toggleVisibility(setShowConfirmPassword)}
                                            >
                                                {showConfirmPassword ?
                                                    <EyeOff className='shrink-0 size-5' /> :
                                                    <Eye className='shrink-0 size-5' />
                                                }
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className='h-6'>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </Field>
                            )}
                        />
                        <Field>
                            <div className='flex items-center gap-2'>
                                <KeyRoundIcon className='size-4' />
                                <FieldLabel>Password strength</FieldLabel>
                            </div>
                            <PasswordStrengthMeter control={control} className='col-span-full' />
                        </Field>
                    </div>
                </div>

                <div className='flex justify-end'>
                    <Button type='submit' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Send data-icon="inline-start" />
                        )}
                        Create account
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}
