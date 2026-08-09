import api from '@/clients/api'
import { InfoAlert } from '@/components/InfoAlert'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { DEBUG } from '@/lib/constants'
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schemas/user-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Eye, EyeOff, KeyRound, Lock, LockOpen, Save } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

function ChangePasswordForm() {
    const { handleSubmit, reset, setError, trigger, control, formState } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        mode: 'onChange',
        defaultValues: {
            oldPassword: '',
            password: {
                value: '',
                confirm: '',
            }
        }
    })
    const { isValid, isSubmitting, isSubmitSuccessful, isDirty } = formState

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const toggleVisibility = (f: typeof setShowPassword) => f((show) => !show);

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            const res = await api.post('/users/change-password/', {
                oldPassword: data.oldPassword,
                newPassword: data.password.value
            })
            if (DEBUG) {
                console.log(res);
            }
            reset()
        } catch (error) {
            if (isAxiosError(error)) {
                const errors = error.response.data
                Object.entries(errors).forEach(([field, messages]) => {
                    setError(field as any, {
                        type: "value",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : messages
                    })
                })
            }
        }
    })

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset className='flex flex-col gap-8' disabled={isSubmitting}>
                {isSubmitSuccessful && (
                    <InfoAlert
                        title='Success'
                        messages={[
                            'Password changed succesfully'
                        ]}
                    />
                )}

                <div className='space-y-2'>
                    <Controller
                        name="oldPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} >
                                <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        type='password'
                                        maxLength={65}
                                        placeholder="••••••••••••"
                                    />
                                    <InputGroupAddon align="inline-start">
                                        {!isDirty || fieldState.invalid ? <LockOpen /> : <Lock className='text-primary-light' />}
                                    </InputGroupAddon>
                                </InputGroup>
                                <div className='h-6'>
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            </Field>
                        )}
                    />
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
                                        {!isDirty || fieldState.invalid ? <LockOpen /> : <Lock className='text-primary-light' />}
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
                                        {!isDirty || fieldState.invalid ? <LockOpen /> : <Lock className='text-primary-light' />}
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
                            <KeyRound className='size-4' />
                            <FieldLabel>Password strength</FieldLabel>
                        </div>
                        <PasswordStrengthMeter control={control} className='col-span-full' />
                    </Field>
                </div>

                <div className='col-span-full flex justify-end'>
                    <Button type='submit' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save changes
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default ChangePasswordForm