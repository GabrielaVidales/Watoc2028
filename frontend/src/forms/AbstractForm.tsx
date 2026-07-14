import React, { useEffect } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstract-schemas'
import { Controller, useFormContext } from 'react-hook-form'
import { InputGroup, InputGroupAddon,  InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'

"DEPRECAR"

type AbstractFormProps = {
    abstract?: AbstractSchema,
    onSubmit?: () => Promise<void> | void
}

function AbstractForm({ abstract }: AbstractFormProps) {
    const { reset, control, formState: { isSubmitting } } = useFormContext<AbstractSchema>()

    useEffect(() => {
        reset(abstract || {})
    }, [abstract])

    return (
        <fieldset disabled={isSubmitting}>
            <div className='space-y-8'>
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
                                    className="border-2"
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
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='min-w-0 w-full'>
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
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
                        <Field data-invalid={fieldState.invalid} className='min-w-0 w-full'>
                            <RichTextEditor
                                {...field}
                                title='Abstract text'
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
                        <Field data-invalid={fieldState.invalid} className='min-w-0 w-full'>
                            <RichTextEditor
                                {...field}
                                title='References'
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
            </div>
        </fieldset>
    )
}

export default AbstractForm

