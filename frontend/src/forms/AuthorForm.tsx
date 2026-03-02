import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authorAffiliationSchema, authorSchema, type AuthorAffiliationSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { countries } from '@/utils/countriesInfo'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Save, Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import axiosClient from '@/clients/axiosClient'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

function AuthorForm() {
    const abstractId = 1
    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm({
        resolver: zodResolver(authorAffiliationSchema),
        mode: 'onChange',
        defaultValues: {
            city: '',
            department: '',
            institute: '',
            nationality: '',
        }
    })

    const [previousAffiliations, setPreviousAffiliations] = useState<AuthorAffiliationSchema[]>(null)


    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data);

        const res = await axiosClient.post('/affiliations/', data)
        console.log(res.data);



    })


    const handleSelectAffiliation = (data: AuthorAffiliationSchema) => {
        reset({ ...data })
    }


    const fetchPreviousAffilliations = async () => {
        const aff = await axiosClient.get<AuthorAffiliationSchema[]>(`/abstracts/${abstractId}/affiliations/`)
        setPreviousAffiliations(aff.data)

        console.log(aff.data);
    }
    useEffect(() => {
        fetchPreviousAffilliations()
    }, [])

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting}>
                <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5'>
                    <div className='space-y-5'>
                        <h2 className='text-lg font-semibold text-primary-main'>Author affiliation</h2>
                        <Controller
                            name={`institute`}
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
                            name={`department`}
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
                            name={`nationality`}
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
                            name={`city`}
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
                    <div className='space-y-5'>
                        <h2 className='text-lg font-semibold text-primary-main'>Previously Used Affiliations</h2>

                        <InputGroup>
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                            <Separator orientation='vertical' className='mx-3' />
                            <InputGroupAddon align="inline-end">
                                12 results
                            </InputGroupAddon>
                        </InputGroup>

                        {previousAffiliations?.map(p => (
                            <div key={p.id}>
                                <div onClick={() => handleSelectAffiliation(p)} className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 transition-all",
                                    "hover:border-primary hover:bg-primary/10",
                                    "border-input bg-background"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div className="grid grid-cols-2 w-full">
                                            <div className="flex flex-col w-full gap-1">
                                                <h3 className="font-medium leading-none">{p.institute}</h3>
                                                <span className="text-sm text-muted-foreground truncate">
                                                    {p.department}
                                                </span>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    Location: {p.nationality}, {p.city}
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