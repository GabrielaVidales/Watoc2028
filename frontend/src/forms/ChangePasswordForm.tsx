import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { changePasswordSchema } from '@/schemas/user-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Eye, EyeOff, Lock, LockOpen, Save } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

function ChangePasswordForm() {
    const { handleSubmit, reset, setError, control, formState } = useForm({
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
    const { isValid, isSubmitting, isSubmitSuccessful } = formState

    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword((show) => !show);

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            const res = await axiosClient.post('/users/change-password/', {
                oldPassword: data.oldPassword,
                newPassword: data.password.value
            })
            if (import.meta.env.DEV) {
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
            <fieldset className='space-y-3 flex flex-col gap-3' disabled={isSubmitting}>
                {isSubmitSuccessful && (
                    <InfoAlert
                        title='Success'
                        messages={[
                            'Password changed succesfully'
                        ]}
                    />
                )}

                <Controller
                    name="oldPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='col-span-full'>
                            <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
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
                                    {isValid ? <Lock /> : <LockOpen />}
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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

                <PasswordStrengthMeter control={control} className='col-span-full' />

                <div className='col-span-full flex justify-end'>
                    <Button type='submit' className='px-10!' disabled={!isValid}>
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