import React, { useEffect } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstract-schemas'
import { Controller, useFormContext } from 'react-hook-form'
import { InfoAlert } from '@/components/InfoAlert'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import RichTextEditor from '@/components/EnrichedTextArea'


type AbstractFormProps = {
    abstract?: AbstractSchema,
    onSubmit?: () => Promise<void> | void
}

function AbstractForm({ abstract }: AbstractFormProps) {
    const mobile = useIsMobile()

    console.log(abstract);


    const { reset, control, formState: { isSubmitting } } = useFormContext<AbstractSchema>()

    useEffect(() => {
        reset(abstract || {})
    }, [abstract])

    // Esta función toma un input, separa las palabras en un Array de string
    // Luego utiliza filter con la función Boolean(value) para eliminar
    // strings vacíos "" que son evaluados como Boolean("") = false y cuenta
    // las palabras reales
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
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    maxLength={128}
                                    spellCheck='false'
                                    autoComplete="off"
                                    className='h-12 text-xl! tracking-wide placeholder:font-normal'
                                />
                                <InputGroupAddon align={mobile ? 'block-end' : "inline-end"}>
                                    <InputGroupText className={mobile ? 'ml-auto' : "tabular-nums"}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            countWords(field.value || "") > 10 && 'text-destructive'
                                        )}>
                                            {countWords(field.value || "")}/10 words
                                        </FieldLabel>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
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

                {/* <RichTextEditor /> */}


                <Controller
                    name="text"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Abstract text</FieldLabel>
                            {/* <InputGroup> */}
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
                                            (fieldState.invalid || countWords(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWords(field.value || "")}/350 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
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
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    placeholder="Provide a concise summary of your work (max. 350 words)..."
                                    className="min-h-20 wrap-anywhere max-h-70"
                                    maxLength={1500}
                                />
                                <InputGroupAddon align={"block-end"}>
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            countWords(field.value || "") > 150 && 'text-destructive'
                                        )}>
                                            {countWords(field.value || "")}/150 words
                                        </FieldLabel>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
        </fieldset>
    )
}

export default AbstractForm

