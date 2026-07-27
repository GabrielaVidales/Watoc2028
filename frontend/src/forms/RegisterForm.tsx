import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod';
import { prefixes, registrationSchema, type RegisterFormValues } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, } from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, KeySquare, Lock, Send, User } from 'lucide-react';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import api from '@/clients/api';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { routes } from '@/routes/routes';
import { AnimatePresence, motion } from 'motion/react';
import { InfoAlert } from '@/components/InfoAlert';
import { isAxiosError } from 'axios';
import { scrollToElement } from '@/lib/utils';
import { useMemo, useState } from 'react';

type TitleProps = {
    icon: React.ElementType
    title: string
}

const Title = ({ icon: Icon, title }: TitleProps) => {
    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-3'>
                {Icon && (
                    <div className="size-8 flex justify-center items-center shrink-0 rounded-full bg-primary-main">
                        <Icon className='text-primary-contrast size-5' />
                    </div>
                )}
                <div className='text-xl font-semibold w-full'>{title}</div>
            </div>
        </div>
    )
}

export default function RegisterForm() {
    const navigate = useNavigate()

    const {
        handleSubmit,
        setError,
        clearErrors,
        trigger,
        control,
        formState: {
            isValid,
            isSubmitting,
            errors,
        }
    } = useForm({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange',
    })

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            await api.post('/users/', data)
            navigate(routes.auth.login, {
                replace: true,
                state: {
                    code: 'account-created',
                    title: 'Verify your email address',
                    email: data.email,
                    description:
                        "We've sent a new verification link to your email address. Please check your inbox and spam folder."
                }
            })

        } catch (error) {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.log(error.response);
                }

                const serverErrors = error.response.data
                Object.keys(serverErrors).forEach((key) => {
                    const fieldName = key as keyof RegisterFormValues
                    const errorValue = serverErrors[fieldName]
                    const schemaName =
                        (fieldName === 'email') ? 'email.value' :
                            (fieldName === 'password') ? 'password.value' : fieldName
                    setError(schemaName, {
                        type: "server",
                        message: errorValue
                    })
                })
                setError('root', {
                    message: 'Registration failed. Please check details and try again.',
                    type: "custom",
                })

            } else {
                setError('root', {
                    message: 'Connection failed. Please try again later.',
                    type: "custom",
                })
                if (import.meta.env.DEV) {
                    console.log(error);
                }
            }
        }
    })

    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);

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
            <AnimatePresence>
                {errors.root && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        onAnimationComplete={() => {
                            if (errors.root) {
                                scrollToElement('registration-form', 175)
                            }
                        }}
                        className="mb-4"
                    >
                        <InfoAlert
                            variant='destructive'
                            messages={[
                                <span className='text-red-950'>
                                    {errors.root.message}
                                </span>
                            ]}
                            title='Server responded with an error:'
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <fieldset className='space-y-5' disabled={isSubmitting}>
                <div className='flex flex-col gap-5'>
                    <Title title='Personal Information' icon={User} />

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 justify-start items-start'>
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
                        name="affiliation"
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='col-span-full'>
                                <FieldLabel htmlFor={field.name}>
                                    Affiliation <div className="text-destructive">*</div>
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
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Job title <div className="text-destructive">*</div>
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
                        name="field_of_study"
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Field of study <div className="text-destructive">*</div>
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
                </div>

                <div className='flex flex-col gap-5 py-5'>
                    <Title title='Account details' icon={KeySquare} />

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
                                        onInput={() => trigger('email.confirm')}
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
                                        autoComplete="off"
                                        placeholder="Re-type your email"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <Separator />

                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-5'>
                        <Controller
                            name="password.value"
                            control={control}
                            defaultValue=''
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Password <div className="text-destructive">*</div>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            onInput={() => trigger('password.confirm')}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="**********"
                                        />
                                        <InputGroupAddon align="inline-start">
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                title='toggle-visibility'
                                                size='icon-xs'
                                                onClick={toggleVisibility}
                                            >
                                                {showPassword ?
                                                    <EyeOff className='shrink-0 size-5' /> :
                                                    <Eye className='shrink-0 size-5' />
                                                }
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    <PasswordStrengthMeter control={control} className='mt-2' />
                                </Field>
                            )}
                        />
                        <Controller
                            name="password.confirm"
                            control={control}
                            defaultValue=''
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Confirm password <div className="text-destructive">*</div>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showPassword ? 'text' : 'password'}
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
        </form>
    )
}
