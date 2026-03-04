import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authorSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { countries } from '@/utils/countriesInfo'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Save, SearchX } from 'lucide-react'
import axiosClient from '@/clients/axiosClient'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { isAxiosError } from 'axios'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


type AbstractFormProps = {
    abstractId?: number,
    author?: AuthorSchema,
    onSubmit?: () => Promise<void> | void
}

function AuthorForm({ abstractId, author, onSubmit }: AbstractFormProps) {
    const { control, handleSubmit, setValue, formState: { isValid, isSubmitting } } = useForm({
        resolver: zodResolver(authorSchema),
        mode: 'onSubmit',
        defaultValues: {
            id: author?.id || undefined,
            first_name: author?.first_name || '',
            last_name: author?.last_name || '',
            email: author?.email || '',
            affiliation: author?.affiliation || {
                city: '',
                department: '',
                institute: '',
                nationality: '',
            }
        }
    })

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            if (data.id) {
                await axiosClient.patch(`/authors/${data.id}/`, {
                    ...data,
                    abstract_id: abstractId || null
                })
            } else {
                await axiosClient.post('/authors/', {
                    ...data,
                    abstract_id: abstractId || null
                })
            }
            onSubmit?.()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    })


    const handleSelectAffiliation = (data: AuthorAffiliationSchema) => {
        setValue('affiliation', { ...data }, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    const [previousAffiliations, setPreviousAffiliations] = useState<AuthorAffiliationSchema[]>(null)
    const fetchPreviousAffilliations = async () => {
        const aff = await axiosClient.get<AuthorAffiliationSchema[]>(`/abstracts/${abstractId}/affiliations/`)
        setPreviousAffiliations(aff.data)
    }
    useEffect(() => {
        fetchPreviousAffilliations()
    }, [])

    return (
        <form onSubmit={onFormSubmit} id='authors-form'>
            <fieldset disabled={isSubmitting}>
                <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5 py-5'>
                    <div className='space-y-8 col-span-3'>
                      
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
                                            placeholder='albert.einstein@tesla.com'
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
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

                        <Accordion type="single" collapsible defaultValue="item-1" className='space-y-5 col-span-2 rounded-lg border shadow-md'>
                            <AccordionItem value="item-1" className='border-b last:border-b-0'>
                                <AccordionTrigger className='px-4'>Previously Used Affiliations</AccordionTrigger>
                                <AccordionContent className='space-y-5 p-4'>
                                    {/* <div className='space-y-5 col-span-2'> */}
                                        {previousAffiliations?.map(p => (
                                            <div key={p.id}>
                                                <div onClick={() => handleSelectAffiliation(p)} className={cn(
                                                    "cursor-pointer rounded-xl border-2 p-4 transition-all",
                                                    "hover:border-primary hover:bg-primary/10",
                                                    "border-input bg-background"
                                                )}>
                                                    <div className="flex flex-col w-full gap-1">
                                                        <div className='justify-self-end'>
                                                            <h3 className="font-medium leading-none">{p.institute}</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-5 w-full">
                                                            <div className='flex flex-col'>
                                                                <span className="text-sm text-muted-foreground truncate">
                                                                    {p.department}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {p.city}, {p.nationality}
                                                                </span>
                                                            </div>
                                                            <div className='justify-self-end'>
                                                                <Button type='button' onClick={() => handleSelectAffiliation(p)}>
                                                                    Select this
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {previousAffiliations?.length === 0 && (
                                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
                                                <div className="rounded-full bg-muted p-3 mb-3">
                                                    <SearchX className="size-6 text-muted-foreground" /> {/* O cualquier icono que uses */}
                                                </div>
                                                <h4 className="font-medium text-muted-foreground">No previous affiliations found</h4>
                                                <p className="text-sm text-muted-foreground/60">
                                                    Start by adding a new affiliation in the form.
                                                </p>
                                            </div>
                                        )}

                                    {/* </div> */}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>



                    <div className='flex justify-end col-span-1 md:col-span-2'>
                        <Button type='submit' className='p-5 w-60 uppercase' disabled={!isValid}>
                            {isSubmitting ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <Save data-icon="inline-start" />
                            )}
                            Save changes
                        </Button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}

export default AuthorForm