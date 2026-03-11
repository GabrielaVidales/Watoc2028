import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type AuthorSchema } from '@/schemas/abstract-schemas'
import { Controller, useFormContext } from 'react-hook-form'
import { countries } from '@/utils/countriesInfo'
import React from 'react'
import { UserSearchInput } from '@/components/UserSearchInput'
import { Separator } from '@/components/ui/separator'


function AuthorForm() {
    const { control, setValue, formState: { isSubmitting } } = useFormContext<AuthorSchema>()

    return (
        <fieldset disabled={isSubmitting}>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5 py-5'>

                <div className='col-span-full flex justify-between items-center'>
                    <div className='flex-1 text-lg font-semibold w-full'>
                        Author Information
                    </div>
                    <UserSearchInput onUserSelected={u => {
                        setValue('first_name', u.first_name, { shouldDirty: true, shouldValidate: true })
                        setValue('last_name', u.last_name, { shouldDirty: true, shouldValidate: true })
                        setValue('email', u.email, { shouldDirty: true, shouldValidate: true })

                        setValue('affiliation.nationality', u.nationality, { shouldDirty: true, shouldValidate: true })
                        setValue('affiliation.city', u.city, { shouldDirty: true, shouldValidate: true })
                        setValue('affiliation.department', u.participant?.job_title, { shouldDirty: true, shouldValidate: true })
                        setValue('affiliation.institute', u.participant?.affiliation, { shouldDirty: true, shouldValidate: true })
                    }} />
                </div>


                <div className='space-y-3 col-span-3'>
                    <div className='space-y-3 grid grid-cols-1 sm:grid-cols-7 gap-x-0 sm:gap-x-5 gap-y-0'>
                        <Controller
                            name={`first_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='col-span-full sm:col-span-2'>
                                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`last_name`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='col-span-full sm:col-span-2'>
                                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`email`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='col-span-full sm:col-span-3'>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                        placeholder='email@example.com'
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <Separator className='my-4' />

                    <div className='flex-1 text-lg font-semibold w-full'>
                        Author Affiliation
                    </div>

                    <div className='space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0'>
                        <Controller
                            name={`affiliation.institute`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Affiliation</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`affiliation.department`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Job Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`affiliation.nationality`}
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
                                            {countries.map(c => (
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
                            name={`affiliation.city`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        maxLength={100}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </div>
            </div>
        </fieldset>
    )
}

export default AuthorForm