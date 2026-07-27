import React from 'react';
import { Controller, useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/schemas/user-schemas';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { isAxiosError } from 'axios';
import { InfoAlert } from '@/components/InfoAlert';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { routes } from '@/routes/routes';

export default function LoginForm() {
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: loginSchema.parse({}),
        mode: 'onChange',
    })

    const { isValid, isSubmitting, errors } = form.formState
    const { setError, clearErrors, handleSubmit } = form

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            await handleLogin(data.email.toLowerCase(), data.password)
            navigate('/user/profile', { replace: true })
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response.data.message) {
                    setError('root', {
                        message: error.response.data.message,
                        type: "400",
                    })
                }
                const serverErrors = error.response.data.errors
                if (serverErrors) {
                    Object.keys(serverErrors).forEach((key) => {
                        const fieldName = key as keyof LoginFormValues
                        const errorValue = serverErrors[fieldName]
                        const message = Array.isArray(errorValue) ? errorValue.join('. ') : errorValue
                        setError(fieldName, {
                            type: "server",
                            message: message
                        }, { shouldFocus: true })
                    })
                }
            } else {
                setError('root', {
                    message: 'Connection failed. Please try again later.',
                    type: "400",
                })
            }
        }
    })

    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);

    return (
        <form onSubmit={onFormSubmit} onInput={() => clearErrors('root')}>
            <AnimatePresence>
                {errors.root && (
                    <motion.div
                        key='error'
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
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

            <fieldset disabled={isSubmitting} className='space-y-5'>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    type='email'
                                    autoComplete='email'
                                    placeholder="yourmail@example.com"
                                />
                                <InputGroupAddon align="inline-start" className={cn(
                                    fieldState.invalid ? 'text-destructive' : ''
                                )}>
                                    <Mail />
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="current-password"
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
                        </Field>
                    )}
                />

                <div className='flex justify-end'>
                    <Link to={routes.auth.forgotPassword} className='w-fit text-primary-main hover:text-primary-light active:text-primary-dark'>
                        Forgot password?
                    </Link>
                </div>

                <div className='flex justify-center w-full'>
                    <Button type='submit' variant='main'
                        className='w-40 p-5 text-xl'
                        data-icon="inline-start"
                        disabled={!isValid}
                    >
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <LogIn className='size-5' />
                        )}
                        Login
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}