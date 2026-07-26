import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { affiliationSchema, type Affiliation } from '@/schemas/affiliation-schema'
import { countries, getCountryImage } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import React from 'react'
import api from '@/clients/api'
import { isAxiosError } from 'axios'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
    defaults?: Affiliation
    onSubmitSuccess?: () => void
}

function AffiliationForm({ defaults, onSubmitSuccess, id }: Props & React.HTMLProps<HTMLFormElement>) {
    const { user: { id: userId } } = useAuth()

    const { control, handleSubmit, reset, resetField, formState: { isDirty, isSubmitting } } = useForm({
        resolver: zodResolver(affiliationSchema),
        mode: 'onChange',
        defaultValues: {
            id: null,
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
        mutationFn: async (data: Affiliation) => await api.post('/abstracts/affiliations/', { ...data, user_id: userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['affiliations'] });
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV)
                    console.error(error.response.data);
            }
        }
    })


    const editMutation = useMutation({
        mutationFn: async (data: Affiliation) => {
            const { id, ...values } = data
            await api.patch(`/abstracts/affiliations/${id}/`, values)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['affiliations'] });
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV)
                    console.error(error.response.data);
            }
        }
    })


    return (
        <form id={id} onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='px-1 space-y-3'>
                <Controller
                    name={'institution'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                maxLength={100}
                            />
                            <div
                                className={cn(
                                    "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                    fieldState.invalid ? " opacity-100" : " opacity-0"
                                )}
                            >
                                <FieldError errors={[fieldState.error]} />
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
                                            {getCountryImage(c.label)}
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                    fieldState.invalid ? " opacity-100" : " opacity-0"
                                )}
                            >
                                <FieldError errors={[fieldState.error]} />
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
                                    "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                    fieldState.invalid ? " opacity-100" : " opacity-0"
                                )}
                            >
                                <FieldError errors={[fieldState.error]} />
                            </div>
                        </Field>
                    )}
                />
            </fieldset>
        </form>
    )
}

export default AffiliationForm

