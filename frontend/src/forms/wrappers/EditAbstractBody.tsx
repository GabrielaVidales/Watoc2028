import React, { useEffect, } from 'react'
import { useParams } from 'react-router'
import { abstractSchema, presentationTypes, submitAbstractDefaults, type AbstractSchema } from '@/schemas/abstract-schemas'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { HardDriveDownload } from 'lucide-react'
import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { InputGroupText } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

type AbstractFormProps = {
    abstract?: AbstractSchema,
}

function EditAbstractBody({ }: AbstractFormProps) {
    const { id } = useParams()

    const queryClient = useQueryClient()

    const { data: abstract } = useQuery<AbstractSchema>({
        queryKey: ['abstract', id],
        queryFn: async () => {
            const { data } = await axiosClient.get(`/abstracts/submissions/${id}/`)
            return data
        }
    })

    const saveMutation = useMutation({
        mutationFn: async (data: AbstractSchema) => {
            const { data: response } = await axiosClient.patch(`/abstracts/submissions/${id}/`, data)
            return response
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abstract', id] }),
        onError: error => {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.error(error.response.data);
                }
            } else if (import.meta.env.DEV) {
                console.error(error);
            }
        }
    })

    const { control, handleSubmit, reset, formState: { isDirty, isSubmitting, isValid } } = useForm({
        resolver: zodResolver(abstractSchema),
        defaultValues: submitAbstractDefaults.parse({}),
        mode: 'onChange',
    })

    const onFormSubmit = handleSubmit(
        async (data) => {
            await saveMutation.mutateAsync(data)
        },
        async (data) => {
            if (import.meta.env.DEV) {
                console.error(data)
            }
        }
    )

    useEffect(() => {
        if (abstract) {
            reset({
                presentation_type: abstract.presentation_type,
                title: abstract.title,
                references: abstract.references,
                text: abstract.text,
            })
        }
    }, [abstract])

    return (
        <form onSubmit={onFormSubmit} id='abstract-submission-form' className='max-w-full py-8 space-y-8'>
            <fieldset disabled={isSubmitting} className='space-y-8'>
                <Controller
                    name="presentation_type"
                    defaultValue='oral'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="presentationType">Presentation Format</FieldLabel>
                            <FieldDescription>Select the preferred format for presenting your work.</FieldDescription>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="presentationType"
                                    aria-invalid={fieldState.invalid}
                                    className="min-w-30 border-2"
                                >
                                    <SelectValue placeholder="Choose an option..." />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {presentationTypes.map(item => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
                            <FieldDescription>
                                Provide a concise, descriptive title (maximum 10 words). Do not include author names, affiliations, or other identifying information.
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                title='Abstract title'
                                invalid={fieldState.invalid}
                                id={field.name}
                                multiline={false}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="wrap-anywhere text-xl"
                                maxLength={3500}
                                footer={
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 10) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/10 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="text"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Abstract text</FieldLabel>
                            <FieldDescription>
                                Abstract text must not exceed 300 words. Abstracts must be writter in English and not contain any information about the presenters or the institutions involves, this is to facilitate the review process.
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                invalid={fieldState.invalid}
                                id={field.name}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                placeholder="Provide a concise summary of your work (max. 350 words)..."
                                className="min-h-40 wrap-anywhere max-h-80"
                                maxLength={3500}
                                footer={
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/350 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="references"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>References</FieldLabel>
                            <FieldDescription>
                                References are required, and must not exceed 150 words.
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                invalid={fieldState.invalid}
                                id={field.name}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                placeholder="Provide the references of your work (max. 350 words)..."
                                className="min-h-20 wrap-anywhere max-h-80"
                                maxLength={2000}
                                footer={
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 150) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/150 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </fieldset>

            <div className="sticky bottom-4 z-20">
                <div className={cn(
                    "ml-auto flex w-fit items-center gap-3 rounded-xl border px-4 py-3 shadow-md",
                    (!isDirty && !isSubmitting) ? 'bg-background/90' : 'bg-background'
                )}>
                    {!isDirty && !isSubmitting ? (
                        <span className="text-sm text-muted-foreground">
                            No unsaved changes
                        </span>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            You have unsaved changes
                        </span>
                    )}

                    <Button
                        type="submit"
                        form="abstract-submission-form"
                        disabled={!isValid || !isDirty}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner />
                                <span>Saving...</span>
                            </>

                        ) : (
                            <>
                                <HardDriveDownload />
                                <span>Save</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default EditAbstractBody