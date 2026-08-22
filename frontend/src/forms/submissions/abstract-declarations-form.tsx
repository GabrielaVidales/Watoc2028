import api from '@/clients/api'
import React, { Fragment, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useIsMobile } from '@/hooks/use-mobile'
import { DEBUG } from '@/lib/constants'
import { abstractDeclarationSchema, declarationsLabels, type AbstractDeclarationValues, } from '@/schemas/abstract-declaration-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { RotateCwIcon, UploadIcon, } from 'lucide-react'
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

    const patchMutation = useMutation<void, AxiosError<any>, AbstractDeclarationValues>({
        mutationFn: async (data: AbstractDeclarationValues) => {
            const res = await api.patch(`/abstracts/submissions/${id}/declarations/`, data)
            if (DEBUG) {
                console.log('Success:', res.data);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['abstract', 'declarations', id],
            })
        },
        onError: (error) => DEBUG && console.log(error.response),
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

    const formName = 'abstract-declarations-form'

    return (
        <form onSubmit={onFormSubmit} id={formName} className='max-w-full space-y-8'>
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

            <div className={"flex w-fit items-center gap-3 ml-auto"}>
                <Button
                    type='button'
                    size={isMobile ? 'sm' : 'default'}
                    variant='outline'
                    onClick={() => reset()}
                    disabled={!isDirty || isSubmitting}
                >
                    <RotateCwIcon className='text-muted-foreground' /> Reset
                </Button>

                <Button
                    type="submit"
                    size={isMobile ? 'sm' : 'default'}
                    form={formName}
                    disabled={!isValid || !isDirty}
                >
                    {isSubmitting ? (
                        <Fragment>
                            <Spinner />
                            <span>Saving...</span>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <UploadIcon />
                            <span>Save Changes</span>
                        </Fragment>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default AbstractDeclarations