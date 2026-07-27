import api from '@/clients/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, } from '@/components/ui/field'
import { Item } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { abstractDeclarationSchema, declarationsLabels, type AbstractDeclarationValues, } from '@/schemas/abstract-declaration-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { HardDriveDownload, RotateCcw, } from 'lucide-react'
import React, { Fragment, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'


function AbstractDeclarations() {
    const { id } = useParams()

    const isMobile = useIsMobile()

    const { data: declarationsData } = useQuery<AbstractDeclarationValues>({
        queryKey: ['abstract', 'declarations', id],
        queryFn: async () => {
            const { data } = await api.get(`/abstracts/submissions/${id}/declarations/`)
            return data
        }
    })

    const queryClient = useQueryClient()

    const patchMutation = useMutation({
        mutationFn: async (data: AbstractDeclarationValues) => {
            const res = await api.patch(`/abstracts/submissions/${id}/declarations/`, data)
            if (import.meta.env.DEV) {
                console.log('Success:', res.data);
            }
        },
        onError: (error) => {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['abstract', 'declarations', id],
            })
        }
    })

    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty, isValid } } = useForm<AbstractDeclarationValues>({
        resolver: zodResolver(abstractDeclarationSchema),
        mode: 'onChange',
        defaultValues: {
            abstract_id: Number(id),
            commitment_attendance: false,
            confirm_accuracy: false,
            consent_publication: false,
            no_ai_used: false,
            not_previously_published: false,
            submit_on_behalf: false,
        }
    })

    const onFormSubmit = handleSubmit(async data => patchMutation.mutate({ ...data }), error => console.error(error))

    useEffect(() => {
        if (declarationsData) {
            reset(declarationsData)
        }
    }, [declarationsData, reset])

    return (
        <form onSubmit={onFormSubmit} id='abstract-declarations-form' className='max-w-full space-y-8'>
            <fieldset disabled={isSubmitting} className='space-y-4'>
                <Controller
                    name="confirm_accuracy"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
                <Controller
                    name="consent_publication"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
                <Controller
                    name="submit_on_behalf"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
                <Controller
                    name="commitment_attendance"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
                <Controller
                    name="not_previously_published"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
                <Controller
                    name="no_ai_used"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className='size-5'
                            />
                            <FieldLabel htmlFor={field.name} className="font-normal cursor-pointer">
                                {declarationsLabels[field.name].title}
                            </FieldLabel>
                        </Field>
                    )}
                />
            </fieldset>

            <div className={cn(
                "sticky select-none",
                isMobile ? 'bottom-5' : "bottom-20",
            )}>
                <div className={cn(
                    "ml-auto flex flex-col-reverse w-60 items-center gap-2 rounded-xl border p-3 shadow-md bg-card",
                    (!isDirty && !isSubmitting) ? 'opacity-70' : 'opacity-100', 'hover:opacity-100',
                )}>
                    <span className="text-xs text-muted-foreground">
                        {!isDirty && !isSubmitting ? "No unsaved changes" : "You have unsaved changes"}
                    </span>

                    <div className='flex justify-between items-center gap-5'>
                        <Button
                            type="submit"
                            size={isMobile ? 'sm' : 'default'}
                            form="abstract-submission-form"
                            disabled={!isValid || !isDirty}
                        >
                            {isSubmitting ? (
                                <Fragment>
                                    <Spinner />
                                    <span>Saving...</span>
                                </Fragment>
                            ) : (
                                <span>Save</span>
                            )}
                        </Button>

                        <Button
                            type='button'
                            size={isMobile ? 'sm' : 'default'}
                            variant='outline'
                            onClick={() => reset()}
                            disabled={!isDirty || isSubmitting}
                        >
                            <RotateCcw className='text-muted-foreground' /> Reset
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AbstractDeclarations