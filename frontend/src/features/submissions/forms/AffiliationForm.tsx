import { notify } from '@/components/custom/notify'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { createAffiliation, handleApiError, updateAffiliation } from '@/features/submissions/services/affiliation-services'
import { countries, getCountryImage } from '@/utils/countriesInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { affiliationSchema, type Affiliation } from '@/features/submissions/schemas/affiliation-schema'

type Props = {
    abstractId?: number | string
    defaults?: Affiliation
    onSubmitSuccess?: () => void
}

function AffiliationForm({ defaults, onSubmitSuccess, id: formId, abstractId }: Props & React.HTMLProps<HTMLFormElement>) {
    const { user: { id: userId } } = useAuth()

    const {
        formState: { isSubmitting },
        handleSubmit,
        control,
        reset,
    } = useForm<Affiliation, any, Affiliation>({
        resolver: zodResolver(affiliationSchema),
        mode: 'onChange',
        defaultValues: {
            id: undefined,
            institution: '',
            country: '',
            city: '',
        },
    })

    const onFormSubmit = handleSubmit(async (data: Affiliation) => {
        const edit = (defaults !== null && defaults.id)
        if (edit) {
            editMutation.mutate(data)
            return
        }
        createMutation.mutate(data)
    })

    const queryClient = useQueryClient()

    const createMutation = useMutation<Affiliation, AxiosError<any>, Affiliation>({
        mutationFn: (data) => createAffiliation({ ...data, user_id: userId }),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['affiliations'] }),
                queryClient.invalidateQueries({ queryKey: ['authors', abstractId], }),
            ])
            notify.success('Affiliation created successfully!', { description: 'Your data have been saved.', })
            onSubmitSuccess?.()
        },
        onError: handleApiError
    })

    const editMutation = useMutation<Affiliation, AxiosError<any>, Affiliation>({
        mutationFn: updateAffiliation,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['affiliations'] }),
                queryClient.invalidateQueries({ queryKey: ['authors', abstractId], }),
            ])
            notify.success('Affiliation edited successfully!', { description: 'Your changes have been saved.', })
            onSubmitSuccess?.()
        },
        onError: handleApiError
    })

    React.useEffect(() => {
        if (defaults) {
            queueMicrotask(() => {
                reset({
                    id: defaults.id,
                    institution: defaults.institution,
                    country: defaults.country,
                    city: defaults.city,
                })
            })
        }
    }, [defaults])

    return (
        <form id={formId} onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='px-1 space-y-1'>
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
                                    "overflow-hidden transition-all h-5 duration-200 ease-in-out",
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
                                    "overflow-hidden transition-all h-5 duration-200 ease-in-out",
                                    fieldState.invalid ? " opacity-100" : " opacity-0"
                                )}
                            >
                                <FieldError errors={[fieldState.error]} />
                            </div>
                        </Field>
                    )}
                />
                <Controller
                    name={'country'}
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
                                    "overflow-hidden transition-all h-5 duration-200 ease-in-out",
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