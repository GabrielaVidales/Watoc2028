import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { urls } from '@/routes/routes'
import { resetPasswordForm, type ResetPasswordFormValues } from '@/schemas/reset-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { ArrowLeft, Eye, EyeOff, Key, Lock, LockOpen, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'

type VerifyState = | "loading" | "success" | "error";

function CreatePasswordPage() {
    const [state, setState] = useState<VerifyState>('loading')
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function verifyToken() {
            if (!token) {
                setState("error");
                setMessage("Verification token is missing.");
                return;
            }

            try {
                const res = await axiosClient.post("/password-reset/verify/", { token });
                console.log(res);

                setState("success");
                setMessage("Your email has been verified successfully.");

            } catch (error: any) {
                setState("error");
                if (error?.response?.data?.detail) {
                    setMessage(
                        error.response.data.detail
                    );
                } else {
                    setMessage(
                        "This verification link is invalid or has expired."
                    );
                }
            }
        }

        verifyToken();
    }, [token])


    if (state === 'loading') {
        return (
            <div>
                Loading...
            </div>
        )
    } else if (state==='error') {
        return(
            <div>
                {message}
            </div>
        )
    }

    return (
        <CreatePasswordForm />
    )
}

export default CreatePasswordPage


export function CreatePasswordForm() {
    const [message, setMessage] = useState('')
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate()

    const {
        control,
        formState: { isSubmitting, errors, isValid, isSubmitSuccessful },
        handleSubmit,
        setError
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordForm),
        mode: 'onChange',
        defaultValues: {
            confirmPassword: '',
            password: '',
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        const payload = {
            token: token,
            password: data.password,
            confirm_password: data.confirmPassword
        }
        try {
            const res = await axiosClient.post('/password-reset/confirm/', payload)
            if (res.data.detail) {
                setMessage(res.data.detail)
                setTimeout(()=>{
                    navigate(urls.auth.login, {
                        replace: true
                    })
                }, 3000)
            }
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
                        const fieldName = key as keyof ResetPasswordFormValues
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
                    message: 'Something went wrong. Please try again later.',
                    type: "400",
                })
            }
        }
    })

    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);


    return (
        <div className='py-10'>
            <Card className="max-w-md w-full mx-auto overflow-hidden pt-0 my-10">
                <CardHeader className="relative h-48 bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #003d9b 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    <div className="relative z-10 w-24 h-24 bg-card rounded-2xl shadow-lg flex items-center justify-center text-primary transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Key className="h-12 w-12" />
                    </div>

                    <div
                        className="absolute top-10 right-20 w-8 h-8 rounded-full bg-primary/10 animate-bounce"
                        style={{ animationDuration: '3000ms' }}
                    />
                    <div className="absolute bottom-8 left-16 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Create a new password</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

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
                        {message && (
                            <motion.div
                                key='success'
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-4"
                            >
                                <InfoAlert
                                    variant='success'
                                    title='Password reset successful'
                                    messages={[
                                        <span className="text-green-950 mb-2">
                                           {message}
                                        </span>,
                                    ]}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form id='forgot-password-form' onSubmit={onFormSubmit} noValidate>
                        <fieldset disabled={isSubmitting || isSubmitSuccessful} className='space-y-4'>

                            <Controller
                                name="password"
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
                                                placeholder="**********"
                                            />
                                            <InputGroupAddon align="inline-start">
                                                {isValid ? <Lock /> : <LockOpen />}
                                            </InputGroupAddon>
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    title='Show password'
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
                            <Controller
                                name="confirmPassword"
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
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Re-type your new password"
                                            />
                                            <InputGroupAddon align="inline-start">
                                                {isValid ? <Lock /> : <LockOpen />}
                                            </InputGroupAddon>
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    title='Show password'
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
                        </fieldset>
                    </form>

                    <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        <p className="font-medium mb-1">Password requirements:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>At least 8 characters long</li>
                            <li>Contains uppercase and lowercase characters</li>
                            <li>Contains at least one number</li>
                            <li>Contains at least one special character</li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className='flex flex-col gap-3'>
                    <Button
                        type="submit"
                        form='forgot-password-form'
                        className="w-full"
                        disabled={isSubmitting || isSubmitSuccessful}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner />
                                Resetting password...
                            </>
                        ) : (
                            'Reset password'
                        )}
                    </Button>
                    <Button asChild variant="link" className="text-sm">
                        <Link to={urls.auth.login}>
                            <ArrowLeft className="h-4 w-4 mr-1 inline" />
                            Back to login
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div >
    )
}

