import api from '@/clients/api'
import { notify } from '@/components/custom/notify'
import { SelectCommand } from '@/components/custom/select-command-generic'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommandShortcut } from "@/components/ui/command"
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Affiliation } from '@/schemas/abstracts/affiliation-schema'
import { authorFormSchema, type AuthorFormSchema, type AuthorSchema } from '@/schemas/abstracts/author-schema'
import type { UserSchema } from '@/schemas/user-schemas'
import { countries, getCountryImage } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Mail, Plus, School } from 'lucide-react'
import React from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'


export function AuthorForm({ children }: React.PropsWithChildren) {
    const form = useForm<AuthorFormSchema>({
        resolver: zodResolver(authorFormSchema),
        mode: 'onChange',
        defaultValues: {
            affiliation_id: null,
            email: '',
            first_name: '',
            id: null,
            is_corresponding_author: false,
            last_name: '',
            order: 1,
            related_user_id: null,
            city: '',
            country: '',
            institution: '',
        }
    })

    return (
        <FormProvider {...form} >
            {children}
        </FormProvider>
    )
}


type Props = {
    abstractId?: number | string
    values?: AuthorSchema
    onSubmit?: () => void
}

export function AuthorFormContent({ abstractId, onSubmit, values }: Props) {
    const queryClient = useQueryClient()

    const { control, setValue, handleSubmit, getValues, reset, formState: { isSubmitting } } = useFormContext<AuthorFormSchema>()
    const [user, setUser] = React.useState<Partial<UserSchema>>(null)
    const handleUserSelection = (user: UserSchema | null) => {
        if (user === null) {
            setValue('related_user_id', null)
            setValue('first_name', '')
            setValue('last_name', '')
            setValue('email', '')
            setUser(null)
            return
        }
        setUser(user)
        setValue('related_user_id', user.id)
        setValue('first_name', user.first_name, { shouldValidate: true })
        setValue('last_name', user.last_name, { shouldValidate: true })
        setValue('email', user.email, { shouldValidate: true })
    }

    const [affiliation, setAffiliation] = React.useState<Affiliation>(null)
    const handleAffiliationSelected = (affiliation: Affiliation | null) => {
        if (affiliation === null) {
            setValue('affiliation_id', null)
            setValue('institution', '')
            setValue('country', '')
            setValue('city', '')
            setAffiliation(null)
            return
        }
        setValue('affiliation_id', affiliation.id)
        setValue('institution', affiliation.institution, { shouldValidate: true })
        setValue('country', affiliation.country, { shouldValidate: true })
        setValue('city', affiliation.city, { shouldValidate: true })
        setAffiliation(affiliation)
    }

    const onFormSubmit = handleSubmit(async (data) => {
        if (!abstractId) {
            notify.destructive('Something went wrong!', {
                description: 'No abstract submission is set to save author information.'
            })
            return
        }

        try {
            if (data.id) {
                const res = await api.patch(`/abstracts/authors/${data.id}/`, { ...data, abstract_id: abstractId })

                if (DEBUG)
                    console.log(res);

                notify.success('Saved successfully!', {
                    description: 'Your changes have been saved.',
                })
            } else {
                const res = await api.post('/abstracts/authors/', { ...data, id: undefined, abstract_id: abstractId })

                if (DEBUG)
                    console.log(res);

                notify.success('Created successfully!', {
                    description: 'The record has been created.',
                })
            }

            queryClient.invalidateQueries({
                queryKey: ['authors', abstractId],
            })

            reset(data)
            onSubmit?.()
        } catch (error) {
            if (isAxiosError(error)) {
                if (DEBUG) {
                    console.error(error.response);
                }
                notify.destructive('Something went wrong!', {
                    description: error.response.data.errors?.email || 'Try again',
                })
            }
        }
    }, async (data) => {
        if (DEBUG) {
            console.error(data, getValues());
        }
    })


    React.useEffect(() => {
        if (values) {
            requestAnimationFrame(() => {
                reset({
                    ...values,
                    affiliation_id: values.affiliation?.id || null,
                    related_user_id: values.related_user?.id || null,
                    institution: values.affiliation?.institution || '',
                    country: values.affiliation?.country || '',
                    city: values.affiliation?.city || '',
                    is_corresponding_author: values.is_corresponding_author,
                }, {
                    keepDefaultValues: false,
                })

                if (values.affiliation) {
                    setAffiliation({
                        id: values.affiliation?.id,
                        institution: values.affiliation?.institution,
                        country: values.affiliation?.country,
                        city: values.affiliation?.city,
                    })
                }

                if (values.related_user) {
                    setUser({
                        id: values.related_user?.id,
                        first_name: values.related_user?.first_name,
                        last_name: values.related_user.last_name,
                        full_name: values.related_user.full_name,
                        email: values.related_user.email,
                        photo: values.related_user.photo,
                    })
                }
            })
        }
    }, [values, setAffiliation, setUser, reset])

    return (
        <form id='author-form' onSubmit={onFormSubmit}>
            <fieldset className='px-1 py-3 space-y-3 grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-3' disabled={isSubmitting}>
                <div className='space-y-3'>
                    {/* Related user */}
                    <Field>
                        <FieldLabel htmlFor={'related-user-id'}>Search registered author</FieldLabel>

                        <SelectCommand<UserSchema>
                            onChange={handleUserSelection}
                            value={user}
                            endpoint='/users/'
                            queryKey='users'
                            getId={u => u.id}
                            getTriggerLabel={user => user ? (
                                <div className='text-left font-normal flex gap-2 items-center'>
                                    <Avatar className="size-8 shrink-0 border shadow-sm">
                                        <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                        <AvatarFallback>
                                            <span className='text-xs leading-0'>
                                                {user?.full_name
                                                    .split(" ")
                                                    .map((x) => x[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                }
                                            </span>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="truncate">
                                        <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                                        <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='text-left font-normal flex gap-2 items-center'>
                                    <Avatar className="size-8 shrink-0 border shadow-sm">
                                        <AvatarImage src={null} />
                                        <AvatarFallback>
                                            NA
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>Not user selected</p>
                                        <p className='text-muted-foreground'>No information displayed</p>
                                    </div>
                                </div>
                            )}
                            className='h-12'
                            contentClassName='md:max-w-70'
                            renderOption={(user) => (
                                <>
                                    <Avatar className="size-8 shrink-0 border shadow-sm">
                                        <AvatarImage loading='lazy' src={user?.photo as string ?? null} />
                                        <AvatarFallback>
                                            <span className='text-xs leading-0'>
                                                {user?.full_name
                                                    .split(" ")
                                                    .map((x) => x[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                }
                                            </span>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="truncate">
                                        <p className="truncate" title={user?.full_name}>{user?.full_name}</p>
                                        <p className='truncate text-muted-foreground text-xs'>{user?.email}</p>
                                    </div>
                                    <CommandShortcut>
                                        <Plus className="size-4" />
                                    </CommandShortcut>
                                </>
                            )}
                        />
                    </Field>

                    <fieldset className='space-y-5 mb-5' disabled={Boolean(user)}>
                        <Controller
                            name={`first_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
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
                                </Field>
                            )}
                        />
                        <Controller
                            name={`last_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
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
                                </Field>
                            )}
                        />
                        <Controller
                            name={`email`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            maxLength={100}
                                            placeholder='email@example.com'
                                        />
                                        <InputGroupAddon align='inline-start'>
                                            <Mail className={cn(fieldState.invalid && 'text-destructive')} />
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end">
                                            <FieldError errors={[fieldState.error]} />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                            )}
                        />
                    </fieldset>

                    <Controller
                        name="is_corresponding_author"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" data-invalid={fieldState.invalid} className='justify-between'>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-rhf-switch-twoFactor">
                                        Mark as corresponding author
                                    </FieldLabel>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id="form-rhf-switch-twoFactor"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                            </Field>
                        )}
                    />
                </div>

                <div className="space-y-3 border-t pt-6 md:pt-0 md:border-t-0 md:border-l-2 md:pl-6">
                    {/* Afiliación */}
                    <Field>
                        <FieldLabel htmlFor={'related-user-id'}>Search existing affiliation</FieldLabel>
                        <SelectCommand<Affiliation>
                            onChange={handleAffiliationSelected}
                            value={affiliation}
                            endpoint='/abstracts/affiliations/'
                            queryKey='affiliations'
                            getId={u => u.id}
                            getTriggerLabel={affiliation => affiliation ? (
                                <div className='text-left font-normal flex gap-2 items-center'>
                                    <Avatar className="size-8 border shadow-sm flex justify-center items-center">
                                        <School className='size-5 text-muted-foreground' />
                                    </Avatar>
                                    <div className='text-sm'>
                                        <p className='tracking-wide font-medium'>{affiliation.institution}</p>
                                        <p className='text-xs text-muted-foreground'>{affiliation.city}, {affiliation.country}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='text-left font-normal flex gap-2 items-center'>
                                    <Avatar className="size-8 border shadow-sm flex justify-center items-center">
                                        <School className='size-5 text-muted-foreground' />
                                    </Avatar>
                                    <div className='text-xs'>
                                        <p className='tracking-wide font-medium'>Not affiliation selected</p>
                                        <p className='text-muted-foreground'>No information displayed</p>
                                    </div>
                                </div>
                            )}
                            className='h-12'
                            contentClassName='md:max-w-70'
                            renderOption={(affiliation) => (
                                <>
                                    <Avatar className="size-8 border shadow-sm flex justify-center items-center">
                                        <School className='size-5 text-muted-foreground' />
                                    </Avatar>

                                    <div className='text-sm'>
                                        <p className='tracking-wide font-medium'>{affiliation.institution}</p>
                                        <p className='text-xs text-muted-foreground'>{affiliation.city}, {affiliation.country}</p>
                                    </div>
                                    <CommandShortcut>
                                        <Plus className='size-5' />
                                    </CommandShortcut>
                                </>
                            )}
                        />
                    </Field>

                    <fieldset className='space-y-5' disabled={Boolean(affiliation)}>
                        <Controller
                            name={'institution'}
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
                                </Field>
                            )}
                        />
                        <Controller
                            name={`country`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-select-nationality"   >
                                            Country
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
                                        >
                                            <SelectValue placeholder="Select an option..." />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {countries.map(c => (
                                                <SelectItem value={c.value as string} key={c.value}>
                                                    {getCountryImage(c.label)}
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                        <Controller
                            name={'city'}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
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
                                </Field>
                            )}
                        />
                    </fieldset>
                </div>
            </fieldset>
        </form>
    )
}
