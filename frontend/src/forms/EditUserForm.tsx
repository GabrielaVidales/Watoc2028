import { InfoAlert } from '@/components/InfoAlert'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { AvatarUpload } from '@/components/ui/upload-avatar'
import { useAuth } from '@/contexts/AuthContext'
import { editUserData, editUserPicture } from '@/domain/auth'
import { userPrefixes } from '@/domain/constants'
import { DEBUG } from '@/lib/constants'
import { editUserFormSchema, type EditUserFormOutput, type EditUserFormValues } from '@/schemas/user-schemas'
import { countries } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Building2, Mail, RotateCcwIcon, SquareUserRound, UploadIcon } from 'lucide-react'
import { Fragment, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'


function EditUserForm() {
    const { user, fetchUser } = useAuth()

    const {
        handleSubmit,
        reset,
        control,
        formState: {
            isSubmitting,
            isValid,
            isDirty,
        },
    } = useForm<EditUserFormValues, any, EditUserFormOutput>({
        resolver: zodResolver(editUserFormSchema),
        mode: 'onChange',
        defaultValues: {
            city: '',
            field_of_study: '',
            first_name: '',
            id: null,
            institution: '',
            job_title: '',
            last_name: '',
            middle_name: '',
            nationality: '',
            photo: null,
            prefix: 'not-set',
            pronouns: '',
            email: {
                value: '',
                confirm: ''
            },
        },
    })

    useEffect(() => {
        if (user) {
            queueMicrotask(() => {
                reset({
                    city: user.city,
                    field_of_study: user.field_of_study,
                    first_name: user.first_name,
                    id: user.id,
                    institution: user.institution,
                    job_title: user.job_title,
                    last_name: user.last_name,
                    middle_name: user.middle_name,
                    nationality: user.nationality,
                    prefix: user.prefix,
                    pronouns: user.pronouns,
                    email: {
                        value: '',
                        confirm: ''
                    },
                })
            })
        }
    }, [user])

    const onFormSubmit = handleSubmit(
        async (data) => {
            try {
                const { photo } = data

                if (photo){
                    await editUserPicture(photo)
                }
                await editUserData(data)
                
                await fetchUser()
                
                reset({
                    ...data,
                    email: {
                        value: data.email,
                        confirm: data.email,
                    }
                })
            } catch (error) {
                if (isAxiosError(error)) {
                    DEBUG && console.log(error.response.data);
                }
            }
        },
        data => console.error(data)
    )

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-8'>
                <CardTitle className="flex gap-3 items-center">
                    <SquareUserRound className='text-primary-main' />
                    <h2 className='text-xl font-semibold'>Personal Information</h2>
                </CardTitle>

                <Controller
                    name='photo'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <AvatarUpload
                                defaultAvatar={user?.photo}
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

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5'>
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
                        name="middle_name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Middle name</FieldLabel>
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

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 justify-start items-start'>
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

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 justify-start items-start'>
                    <Controller
                        name="institution"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FieldError errors={[fieldState.error]} />
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>Name of institution, company, etc.</FieldDescription>
                            </Field>
                        )}
                    />
                    <Controller
                        name="job_title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FieldError errors={[fieldState.error]} />
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>Your current position or role</FieldDescription>
                            </Field>
                        )}
                    />
                    <Controller
                        name="field_of_study"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Field of study</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FieldError errors={[fieldState.error]} />
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>The major or primary area of your degree.</FieldDescription>
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

                <div className={"flex w-fit items-center gap-3 ml-auto"}>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={!isDirty}
                    >
                        <RotateCcwIcon className='text-muted-foreground' /> Reset
                    </Button>

                    <Button
                        type="submit"
                        form="edit-participant-form"
                        disabled={!isValid || !isDirty}
                        onClick={onFormSubmit}
                    >
                        {isSubmitting ? (
                            <Fragment>
                                <Spinner />
                                <span>'Saving...'</span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <UploadIcon />
                                <span>{(isDirty && isValid) ? 'Save changes' : 'No Changes'}</span>
                            </Fragment>
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default EditUserForm