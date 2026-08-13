import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useIsMobile } from '@/hooks/use-mobile'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import { emailAddressForm, type EmailAddressFormValues } from '@/schemas/reset-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'


type RequestPasswordResetResponse = {
    detail: string
}

function ForgotPasswordPage() {
    const isMobile = useIsMobile()

    const { control, handleSubmit, setError, formState: { isSubmitting, isSubmitSuccessful } } = useForm<EmailAddressFormValues>({
        resolver: zodResolver(emailAddressForm),
        mode: 'onChange',
        defaultValues: {
            email: ''
        }
    })

    const sentMutation = useMutation<RequestPasswordResetResponse, AxiosError, EmailAddressFormValues>({
        mutationFn: async (emailData) => {
            const { data } = await api.post<RequestPasswordResetResponse>('/auth/password-reset/request/', emailData)
            return data
        },
        onSuccess: (response) => {
            notify.success('Check your email', {
                description: response.detail
            })
        },
        onError: (error) => {
            const data = (error.response.data as any)

            if (data.message) {
                notify.destructive('Something went wrong!', {
                    description: `Server responded with code ${error.response.status}: ${data.message}`
                })
            }

            const serverErrors = data.errors
            if (serverErrors) {
                Object.keys(serverErrors).forEach((key) => {
                    const fieldName = key as keyof EmailAddressFormValues
                    const errorValue = serverErrors[fieldName]
                    const message = Array.isArray(errorValue) ? errorValue.join('. ') : errorValue

                    setError(fieldName, {
                        type: "validate",
                        message: message
                    }, { shouldFocus: true })

                    notify.destructive('Something went wrong!', {
                        description: message
                    })
                })
            }
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        DEBUG && console.log(data);
        try {
            const response = await sentMutation.mutateAsync(data)
            DEBUG && console.log(response);
        } catch (error) {
            DEBUG && console.log(error);
        }
    })

    return (
        <div className='mx-auto w-full h-full flex justify-center items-start p-2 sm:p-4 md:p-6 pt-0'>
            <Card className='max-w-md w-full mx-auto shadow-xl pb-12'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                >
                    <CardHeader className="relative h-32 bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center border-y">
                        <div
                            className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #003d9b 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />

                        <div className="relative z-10 size-20 bg-card rounded-2xl shadow-lg flex items-center justify-center text-primary transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Mail className="h-12 w-12" />
                        </div>

                        <div
                            className="absolute top-10 right-20 w-8 h-8 rounded-full bg-primary/10 animate-bounce"
                            style={{ animationDuration: '3000ms' }}
                        />
                        <div className="absolute bottom-8 left-16 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                    </CardHeader>

                    <CardContent className="py-6 space-y-4">
                        <div className='space-y-2 text-center flex flex-col items-center justify-center'>
                            <h2 className='text-2xl font-semibold text-foreground'>Forgot password?</h2>
                            <div className='h-1 w-12 mx-auto bg-primary-main rounded-full' />
                            <p className='text-muted-foreground pt-2 text-sm'>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

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
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    maxLength={100}
                                                    autoComplete='email'
                                                    type='email'
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        type="submit"
                                                        size={isMobile ? 'icon-xs' : 'xs'}
                                                        variant={fieldState.invalid ? 'destructive' : 'main'}
                                                        className='ml-auto'
                                                        form='forgot-password-form'
                                                        disabled={isSubmitting || isSubmitSuccessful}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Spinner />
                                                                <span className={cn(isMobile && 'hidden')}>
                                                                    Sending...
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className={cn(isMobile && 'hidden')}>
                                                                    Send link
                                                                </span>
                                                                <Send />
                                                            </>
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldError allocateLayout size='xs' errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </fieldset>
                        </form>
                    </CardContent>

                    <Separator className='mb-6' />

                    <CardFooter className='block text-center'>
                        <Link to={routes.auth.login} className='max-w-xs mx-auto text-center text-xs text-muted-foreground'>
                            <ArrowLeft className="h-4 w-4 mr-1 inline" />
                            Back to login
                        </Link>
                    </CardFooter>
                </motion.div>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage