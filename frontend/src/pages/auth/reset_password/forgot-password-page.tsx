import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { urls } from '@/routes/routes'
import { emailAddressForm, type EmailAddressFormValues } from '@/schemas/reset-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { ArrowLeft, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

function ForgotPasswordPage() {
    const [message, setMessage] = useState('')
    const { control, handleSubmit, setError, formState: { isSubmitting, errors, isSubmitSuccessful } } = useForm<EmailAddressFormValues>({
        resolver: zodResolver(emailAddressForm),
        mode: 'onChange',
        defaultValues: {
            email: ''
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data);
        try {
            const res = await axiosClient.post('/password-reset/request/', data)
            if (res.data.detail) {
                setMessage(res.data.detail)
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
                        const fieldName = key as keyof EmailAddressFormValues
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
                        <Mail className="h-12 w-12" />
                    </div>

                    <div
                        className="absolute top-10 right-20 w-8 h-8 rounded-full bg-primary/10 animate-bounce"
                        style={{ animationDuration: '3000ms' }}
                    />
                    <div className="absolute bottom-8 left-16 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Forgot password?</h1>
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
                                        title='Check your email'
                                        messages={[
                                            <span className="text-green-950 mb-2">
                                                If an account exists with this email address, you will receive
                                                a password reset link shortly.
                                            </span>,
                                            <span className="text-xs text-green-950">
                                                Didn't receive it? Check your spam folder or try again.
                                            </span>,
                                        ]}
                                    />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form id='forgot-password-form' onSubmit={onFormSubmit} noValidate>
                        <fieldset disabled={isSubmitting || isSubmitSuccessful}>

                            <Controller
                                name="email"
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
                                            aria-invalid={fieldState.invalid}
                                            maxLength={100}
                                            type='email'
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </fieldset>
                    </form>
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
                                Sending...
                            </>
                        ) : (
                            'Send reset link'
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
        </div>
    )
}

export default ForgotPasswordPage