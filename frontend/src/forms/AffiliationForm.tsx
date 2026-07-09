import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { affiliationSchema, type Affiliation } from '@/schemas/affiliation-schema'
import { countries } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import React from 'react'
import axiosClient from '@/clients/axiosClient'

type Props = {
    defaults?: Affiliation
    onSubmitSuccess?: () => void
}

function AffiliationForm({ defaults, onSubmitSuccess, id }: Props & React.HTMLProps<HTMLFormElement>) {

    const { control, handleSubmit, reset, resetField, formState: { isDirty, isSubmitting } } = useForm({
        resolver: zodResolver(affiliationSchema),
        mode: 'onChange',
        defaultValues: {
            institution: '',
            city: '',
            country: '',
            ...defaults
        },
    })

    const onFormSubmit = handleSubmit(async (data: Affiliation) => {
        const edit = (defaults !== null && defaults.id)
        console.log(defaults, edit ? 'Editando' : 'Creando');
        if (edit) {
            editMutation.mutate(data)
        } else {
            createMutation.mutate(data)
        }
        onSubmitSuccess?.()
    })

    React.useEffect(() => {
        reset(defaults ? defaults : {
            institution: '',
            city: '',
            country: '',
        })
    }, [defaults])

    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: async (data: Affiliation) => await axiosClient.post('/abstracts/affiliations/', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['affiliations'] });
        },
    })


    const editMutation = useMutation({
        mutationFn: async (data: Affiliation) => {
            const { id, ...values } = data
            await axiosClient.patch(`/abstracts/affiliations/${id}/`, values)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['affiliations'] });
        },
    })


    return (
        <form id={id} onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-3'>
                <Controller
                    name={'institution'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
                            <FieldDescription>
                                Enter the name of the institution or organization.
                            </FieldDescription>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                maxLength={100}
                            />

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    fieldState.invalid
                                        ? "h-8 opacity-100"
                                        : "h-0 opacity-0"
                                )}
                            >
                                {fieldState.invalid &&
                                    <FieldError errors={[fieldState.error]} />
                                }
                            </div>
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
                                    className="min-w-30"
                                >
                                    <SelectValue placeholder="Select an option..." />
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
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    fieldState.invalid
                                        ? "h-8 opacity-100"
                                        : "h-0 opacity-0"
                                )}
                            >
                                {fieldState.invalid &&
                                    <FieldError errors={[fieldState.error]} />
                                }
                            </div>
                        </Field>
                    )}
                />

                <Controller
                    name={'city'}
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
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    fieldState.invalid
                                        ? "h-8 opacity-100"
                                        : "h-0 opacity-0"
                                )}
                            >
                                {fieldState.invalid &&
                                    <FieldError errors={[fieldState.error]} />
                                }
                            </div>
                        </Field>
                    )}
                />
            </fieldset>
        </form>
    )
}

export default AffiliationForm

