import api from '@/clients/api'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroupText } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { abstractSchema, presentationTypes, submitAbstractDefaults, type AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { HardDriveDownload, RotateCcw, SaveIcon, ScanText } from 'lucide-react'
import { useEffect, } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

type AbstractFormProps = {
    abstract?: AbstractSchema,
}

function EditAbstractBody({ }: AbstractFormProps) {
    const { id } = useParams()

    const isMobile = useIsMobile()

    const queryClient = useQueryClient()

    const { data: abstract } = useQuery<AbstractSchema>({
        refetchOnWindowFocus: false,
        queryKey: ['abstract', id],
        queryFn: async () => {
            const { data } = await api.get(`/abstracts/submissions/${id}/`)
            return data
        },
    })

    const saveMutation = useMutation({
        mutationFn: async (data: AbstractSchema) => {
            const { data: response } = await api.patch(`/abstracts/submissions/${id}/`, data)
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
        mode: 'onChange',
        defaultValues: {
            presentation_type: null,
            references: '',
            title: '',
            text: '',
        },
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
        <form onSubmit={onFormSubmit} id='abstract-submission-form' className='space-y-5'>
            <fieldset disabled={isSubmitting} className='space-y-8'>
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
                                    className="min-w-30"
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
                            <FieldDescription className='max-sm:text-xs'>Select the preferred format for presenting your work.</FieldDescription>
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
                            <FieldDescription className='max-sm:text-xs'>
                                Provide a concise, descriptive title (maximum 10 words). Please do not include author names, affiliations, or other identifying information.
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
                                    <InputGroupText className={'w-full min-h-5 flex flex-col-reverse gap-0 md:flex-row'}>
                                        {fieldState.invalid ? (
                                            <FieldError errors={[fieldState.error]} />
                                        ) : (
                                            <FieldLabel htmlFor={field.name} className={cn(
                                                'font-normal ml-auto',
                                                (fieldState.invalid || countWordsFromHTML(field.value || "") > 10) && 'text-destructive'
                                            )}>
                                                {countWordsFromHTML(field.value || "")}/10 words
                                            </FieldLabel>
                                        )}
                                    </InputGroupText>
                                }
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="text"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Abstract text</FieldLabel>
                            <FieldDescription className='max-sm:text-xs'>
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
                                    <InputGroupText className={'w-full min-h-5 flex flex-col-reverse gap-0 md:flex-row'}>
                                        {fieldState.invalid ? (
                                            <FieldError errors={[fieldState.error]} />
                                        ) : (
                                            <FieldLabel htmlFor={field.name} className={cn(
                                                'font-normal ml-auto',
                                                (fieldState.invalid || countWordsFromHTML(field.value || "") > 350) && 'text-destructive'
                                            )}>
                                                {countWordsFromHTML(field.value || "")}/350 words
                                            </FieldLabel>
                                        )}
                                    </InputGroupText>
                                }
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="references"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>References</FieldLabel>
                            <FieldDescription className='max-sm:text-xs'>
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
                                    <InputGroupText className={'w-full min-h-5 flex flex-col-reverse gap-0 md:flex-row'}>
                                        {fieldState.invalid ? (
                                            <FieldError errors={[fieldState.error]} />
                                        ) : (
                                            <FieldLabel htmlFor={field.name} className={cn(
                                                'font-normal ml-auto',
                                                (fieldState.invalid || countWordsFromHTML(field.value || "") > 150) && 'text-destructive'
                                            )}>
                                                {countWordsFromHTML(field.value || "")}/150 words
                                            </FieldLabel>
                                        )}
                                    </InputGroupText>
                                }
                            />
                        </Field>
                    )}
                />

                <div className={cn("sticky", isMobile ? 'bottom-5' : "bottom-20")}>
                    <div className={cn(
                        "ml-auto flex flex-col-reverse w-fit items-center gap-1 rounded-xl border p-3 shadow-md",
                        (!isDirty && !isSubmitting) ? 'bg-background/90' : 'bg-background'
                    )}>
                        {!isDirty && !isSubmitting ? (
                            <span className="max-sm:text-xs text-sm text-muted-foreground">
                                No unsaved changes
                            </span>
                        ) : (
                            <span className="max-sm:text-xs text-sm text-muted-foreground">
                                You have unsaved changes
                            </span>
                        )}

                        <div className='flex items-center gap-3'>
                            <Button
                                type="submit"
                                size={isMobile ? 'sm' : 'default'}
                                form="abstract-submission-form"
                                disabled={!isValid || !isDirty}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        <span>Saving...</span>
                                    </>
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
            </fieldset>
        </form>
    )
}

export default EditAbstractBody