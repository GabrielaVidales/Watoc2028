import { Stack, InputAdornment, Paper, Box, IconButton, Typography } from '@mui/material'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, Send, LogIn } from 'lucide-react'; // Íconos de Lucide
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { REGEX_EMAIL } from '../utils/formRegex';
import { useAuth } from '../contexts/AuthContext';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/user-schemas';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function LoginForm() {
    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const methods = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: loginSchema.parse({}),
        mode: 'onChange',
    })

    const { isValid, isSubmitting } = methods.formState


    const onFormSubmit = methods.handleSubmit(async (data) => {
        try {
            await handleLogin(data.email, data.password)
            navigate('/success')
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error.response);
            }
        }
    })

    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-5'>
                <Controller
                    name="email"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="yourmail@example.com"
                                />
                                <InputGroupAddon align="inline-start">
                                    <Mail />
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
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
                        </Field>
                    )}
                />

                <div className='flex justify-end'>
                    <Link to='#' className='w-fit text-primary-main hover:text-primary-light active:text-primary-dark'>
                        Forgot password?
                    </Link>
                </div>

                <div className='flex justify-center w-full'>
                    <Button type='submit' className='w-40 p-5 text-xl' data-icon="inline-start" disabled={!isValid}>
                        <LogIn className='size-5' />
                        Login
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}