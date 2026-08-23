import api from '@/clients/api'
import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { AvatarUpload } from '@/components/ui/upload-avatar'
import { useAuth } from '@/contexts/AuthContext'
import { userPrefixes } from '@/domain/constants'
import { useProfiles } from '@/hooks/use-profiles'
import { DEBUG } from '@/lib/constants'
import { editUserFormSchema, type EditUserFormValues } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Building2, IdCard, Mail, Save, SquareUserRound } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type P = {
    defaultValues?: EditUserFormValues
}

function EditUserForm({ defaultValues }: P) {
    const { fetchUser } = useAuth()
    const { profile, fetchProfile } = useProfiles()

    const { handleSubmit, reset, control, formState } = useForm({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            ...defaultValues,
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
        if (defaultValues) {
            reset({
                ...defaultValues,
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
    }, [defaultValues, profile])

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            await api.patch(`/users/${data.id}/`, {
                ...data,
                email: data.email.value || undefined
            })
            await fetchUser()
            await fetchProfile()
        } catch (error) {
            if (DEBUG) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    })

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-5'>
                <CardTitle className="flex gap-3 items-center">
                    <SquareUserRound className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Profile Picture</h2>
                </CardTitle>

                <Controller
                    name='photo'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <AvatarUpload
                                defaultAvatar={defaultValues?.photo as string}
                                accept=".png,.jpg,.jpeg,.webp"
                                onFileChange={(files) => {
                                    queueMicrotask(() => {
                                        field.onChange(files?.file || null)
                                    })
                                }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Separator />

                <CardTitle className="flex gap-3 items-center">
                    <IdCard className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Personal Information</h2>
                </CardTitle>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
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
                                        {userPrefixes.map(p => (
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

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-start items-start'>
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

                <CardTitle className="flex gap-3 items-center">
                    <Building2 className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Professional Affiliation</h2>
                </CardTitle>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-start items-start'>
                    <Controller
                        name="participant.affiliation"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
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
                </div>

                <Separator />

                <CardTitle className="flex gap-3 items-center">
                    <Mail className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Change your email</h2>
                </CardTitle>

                <InfoAlert
                    className='col-span-full'
                    variant='warning'
                    title="IMPORTANT"
                    messages={[
                        <p>Leave it blank if you don't want to change it.</p>,
                        <p className='text-xs'>Please ensure you have access to the new email before saving your changes.</p>,
                    ]}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Controller
                        name="email.value"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>New Email Address</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    type='email'
                                    placeholder="name@example.com"
                                />
                                <FieldDescription>This will be your login email</FieldDescription>
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
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    placeholder="Re-type your email"
                                />
                                <FieldDescription>Please re-enter your email</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

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