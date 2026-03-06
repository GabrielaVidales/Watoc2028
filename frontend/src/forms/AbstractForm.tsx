import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { abstractSchema, presentationTypes, submitAbstractDefaults, type AbstractSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm, useFormContext, useWatch, type FormState } from 'react-hook-form'
import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import { forwardRef, useImperativeHandle, type Ref } from "react";


type AbstractFormProps = {
    abstract?: AbstractSchema,
    onSubmit?: () => Promise<void> | void
}

function AbstractForm({ abstract }: AbstractFormProps) {
    const { reset, control, watch, formState: { isSubmitting } } = useFormContext<AbstractSchema>()

    useEffect(() => {
        reset(abstract || {})
    }, [abstract])

    const textContent = watch('text')
    const titleContent = watch('title')
    const referencesContent = watch('references')

    const countWords = (input: string) => input?.split(/\s+/).filter(Boolean).length

    return (
        <fieldset disabled={isSubmitting}>
            <div className='space-y-7'>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Your awesome title..."
                                maxLength={128}
                                autoComplete="off"
                                className='h-12 text-xl! tracking-wide placeholder:font-normal'
                            />
                            <FieldContent>
                                <span className='text-sm'>
                                    <span className='font-medium'>Word count:</span> {countWords(titleContent)} / 10
                                </span>
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="presentation_type"
                    defaultValue='oral'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="presentationType">Presentation Format</FieldLabel>
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
                            <FieldDescription>Select the preferred format for presenting your work.</FieldDescription>
                        </Field>
                    )}
                />

                <Controller
                    name="text"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Abstract text</FieldLabel>
                            <Textarea
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                placeholder="Provide a concise summary of your work (max. 500 words)..."
                                className="min-h-40 wrap-anywhere"
                                maxLength={3500}
                            />
                            <FieldContent>
                                <span className='text-sm'>
                                    <span className='font-medium'>Word count:</span> {countWords(textContent)} / 350
                                </span>
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <InfoAlert
                    variant='warning'
                    title='IMPORTANT'
                    messages={'Total character count is 2,600 and includes spaces. Tables and images are not included, as only text is allowed. You will be able to see your character count below the text boxes.'}
                    className='mx-auto'
                />

                <Controller
                    name="references"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>References</FieldLabel>
                            {/* <FieldDescription>Enter the numbered references below in Vancouver format.</FieldDescription> */}
                            <Textarea
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="min-h-25 wrap-anywhere"
                                placeholder="Enter your numbered references here (max. 150 words)..."
                                maxLength={1500}
                            />
                            <FieldContent>
                                <span className='text-sm'>
                                    <span className='font-medium'>Word count:</span> {countWords(referencesContent)} / 150
                                </span>
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            {/* <FieldDescription className='flex justify-end'>
                                <WordCounter control={control} limit={150} name={field.name} />
                            </FieldDescription> */}
                        </Field>
                    )}
                />
            </div>
        </fieldset>
    )
}

export default AbstractForm

