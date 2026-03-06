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
import { Controller, useForm, useWatch, type FormState } from 'react-hook-form'
import axiosClient from '@/clients/axiosClient'
import { InfoAlert } from '@/components/InfoAlert'
import { forwardRef, useImperativeHandle, type Ref } from "react";

export type AbstractFormState = {
    isValid?: boolean
    trigger: () => Promise<boolean>
}

type AbstractFormProps = {
    abstract?: AbstractSchema,
    onSubmit?: () => Promise<void> | void
}

function AbstractForm({ abstract, onSubmit }: AbstractFormProps, ref?: Ref<AbstractFormState>) {
    const { handleSubmit, reset, control, watch, trigger, formState: { isValid, isSubmitting } } = useForm({
        resolver: zodResolver(abstractSchema),
        defaultValues: submitAbstractDefaults.parse({}),
        mode: 'onSubmit',
    })

    useImperativeHandle(ref, () => ({
        isValid,
        trigger: async () => {
            const value = await trigger()

            return value
        }
     }));


    useEffect(() => {
        reset(abstract || {})
    }, [abstract])

    const onFormSubmit = handleSubmit(async (data) => {
        await new Promise(r => setTimeout(r, 1000))

        if (!data.id || data.id === -1) {
            console.log('Invalid ID');
            return
        }

        const res = await axiosClient.patch<AbstractSchema>(`/abstracts/${abstract.id}/`, data)
        console.log(res);

        onSubmit?.()

    }, invalid => {
        console.log(invalid);
    })

    const textContent = watch('text')

    const countWords = (input: string) => input?.split(/\s+/).filter(Boolean).length

    return (
        <form onSubmit={onFormSubmit} id='abstract-submission-form'>
            <fieldset disabled={isSubmitting}>
                <div className='space-y-7'>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                                <FieldDescription>The abstract title must have a maximum of 10 words.</FieldDescription>
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
                                <FieldDescription>Select the preferred format for presenting your work.</FieldDescription>
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
                                <FieldDescription>Enter the abstract content below.</FieldDescription>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    placeholder="Provide a concise summary of your work (max. 500 words)..."
                                    className="min-h-40 max-h-90"
                                    maxLength={3500}
                                />
                                <FieldDescription className='flex justify-end'>
                                    <WordCounter control={control} limit={500} name={field.name} />
                                </FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Field data-invalid={countWords(textContent) > 500}>
                        <FieldLabel htmlFor={'field.name'}>Word Count</FieldLabel>
                        <FieldContent>
                            Words: {countWords(textContent)} / 500
                        </FieldContent>
                        <InfoAlert
                            variant='warning'
                            title='IMPORTANT'
                            messages={'Total character count is 2,600 and includes spaces. Tables and images are not included, as only text is allowed. You will be able to see your character count below the text boxes.'}
                            className='mx-auto'
                        />
                        {countWords(textContent) > 500 && <FieldError errors={[{ message: 'Se excedió el límite de palabras para el abstract.' }]} />}
                    </Field>

                    <Controller
                        name="references"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>References</FieldLabel>
                                <FieldDescription>Enter the numbered references below in Vancouver format.</FieldDescription>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    className="min-h-25 max-h-50"
                                    placeholder="Enter your numbered references here (max. 150 words)..."
                                    maxLength={1500}
                                />
                                <FieldDescription className='flex justify-end'>
                                    <WordCounter control={control} limit={150} name={field.name} />
                                </FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className='flex flex-col items-start gap-3 w-full'>
                        <Button type='submit' className='p-5 w-60 uppercase' >
                            {isSubmitting ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <Save data-icon="inline-start" />
                            )}
                            Save abstract
                        </Button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}

export default forwardRef(AbstractForm)


const WordCounter = ({ control, name, limit }: { control: any, name: string, limit: number }) => {
    const text = useWatch({
        control: control,
        name: name,
        defaultValue: '',
    })

    return (
        <span className='text-xs text-muted-foreground'>
            {text?.split(/\s+/).filter(Boolean).length} / {limit}
        </span>
    )
}

