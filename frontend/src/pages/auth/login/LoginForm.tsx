import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { loginSchema, type LoginFormValues } from '@/schemas/users/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { notify } from '@/components/custom/notify';
import { handleApiFormError } from '@/services/common';

export default function LoginForm() {
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);

    const { setError, clearErrors, handleSubmit, control, formState: { isDirty, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    })


    const onFormSubmit = handleSubmit(async (data) => {
        await post.mutateAsync(data)
    })

    const post = useMutation({
        mutationFn: async (data: LoginFormValues) => await handleLogin(data.email.toLowerCase(), data.password),
        onSuccess: () => navigate(routes.users.profile, { replace: true }),
        onError: (error) => handleApiFormError(error, setError, notify, clearErrors),
    })

    return (
        <form onSubmit={onFormSubmit} onInput={() => clearErrors('root')} noValidate>
            <fieldset disabled={isSubmitting} className='space-y-3'>
                <Controller
                    name="email"
                    control={control}
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
                            <FieldError allocateLayout size='xs' errors={[fieldState.error]} />
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={control}
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
                            <FieldError allocateLayout size='xs' errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className='flex justify-end'>
                    <Link to={routes.auth.forgotPassword} className={cn(
                        "text-sm underline underline-offset-3 text-primary-main",
                        "hover:text-primary-light hover:decoration-double active:text-primary-dark"
                    )}>
                        Forgot password?
                    </Link>
                </div>

                <div className='flex justify-center w-full'>
                    <Button
                        className='px-4!'
                        type='submit'
                        variant='main'
                        data-icon="inline-start"
                        disabled={!isDirty}
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