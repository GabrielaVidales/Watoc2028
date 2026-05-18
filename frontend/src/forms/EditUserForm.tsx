import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthContext'
import { useProfiles } from '@/hooks/use-profiles'
import { editUserFormSchema, prefixes, type EditUserFormValues } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type P = {
    defaultValues?: EditUserFormValues
}

function EditUserForm({ defaultValues }: P) {
    const { currentUser, fetchUser } = useAuth()
    const { profile, fetchProfile } = useProfiles()

    const { handleSubmit, reset, control, formState } = useForm({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            ...currentUser,
            email: {
                value: '',
                confirm: ''
            },
            participant: {
                affiliation: '',
                job_title: '',
                field_of_study: ''
            }
        },
        mode: 'onChange',
    })

    const { isSubmitting, isValid, isDirty } = formState

    useEffect(() => {
        if (currentUser) {
            reset({
                ...currentUser,
                email: {
                    value: '',
                    confirm: ''
                },
                participant: {
                    affiliation: profile?.participant?.affiliation,
                    job_title: profile?.participant?.job_title,
                    field_of_study: profile?.participant?.field_of_study
                }
            })
        }
    }, [currentUser, profile])

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            await axiosClient.patch(`/users/${data.id}/`, {
                ...data,
                email: data.email.value || undefined
            })
            await fetchUser()
            await fetchProfile()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    })

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-5'>
                <h2 className='text-xl font-semibold'>Personal information</h2>

                {/* <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 justify-start items-start'> */}
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    <Controller
                        name="prefix"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-select-prefix"   >
                                        Prefix
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
                                        className="min-w-30"
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
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>First name</FieldLabel>
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
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
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
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 justify-start items-start'>
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-select-nationality"   >
                                        Nationality
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
                                        {countries
                                            .sort((a, b) => a.label.localeCompare(b.label))
                                            .map(c => (
                                                <SelectItem value={c.value as string} key={c.value}>
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        srcSet={`https://flagcdn.com/w40/${c.value.toString().toLowerCase()}.png 2x`}
                                                        src={`https://flagcdn.com/w20/${c.value.toString().toLowerCase()}.png`}
                                                        alt=""
                                                    />
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}   >City</FieldLabel>
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

                <Separator />

                <h2 className='text-xl font-semibold'>Change your email</h2>
                <InfoAlert
                    className='col-span-full'
                    title="IMPORTANT"
                    messages={[
                        'Updating your email address will require you to use the new address for all future logins. Please ensure you have access to the new email before saving your changes.',
                        "Leave it blank if you don't want to change it",
                    ]}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <Controller
                        name="email.value"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>New Email <address></address></FieldLabel>
                                <FieldDescription>This will be your login email</FieldDescription>
                                <Input
                                    {...field}
                                    id={field.name}
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
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Confirm New email</FieldLabel>
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

                <h2 className='text-xl font-semibold'>Professional Affiliation</h2>
                <Controller
                    name="participant.affiliation"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Affiliation</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            <FieldDescription>Name of institution, company, etc.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="participant.job_title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            <FieldDescription>Your current position or role</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="participant.field_of_study"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Field of study</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            <FieldDescription>The major or primary area of your degree.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className='flex justify-end'>
                    <Button type='submit' className='p-5 w-60 uppercase' disabled={!isValid || !isDirty}>
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

export default EditUserForm