import api from '@/clients/api'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { InputGroupText } from '@/components/ui/input-group'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createSubmission, updateSubmission, type UpdateParams } from '@/services/submissions/submission-services'
import { abstractSchema, presentationTypes, type AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { RotateCcw, Upload } from 'lucide-react'
import { Fragment, useEffect, } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { DEBUG } from '@/lib/constants'
import { notify } from '@/components/custom/notify'
import { Checkbox } from '@/components/ui/checkbox'
import { AnimatePresence, motion } from 'motion/react'

type AbstractFormProps = {
    abstractId?: number | null,
}

function AbstractContentForm({ abstractId = null }: AbstractFormProps) {
    const queryClient = useQueryClient()

    const { data: abstract } = useQuery<AbstractSchema>({
        refetchOnWindowFocus: false,
        queryKey: ['abstract', abstractId],
        queryFn: async () => {
            const { data } = await api.get(`/abstracts/submissions/${abstractId}/`)
            return data
        },
        enabled: abstractId !== null,
    })

    const onError = (error: AxiosError) => {
        if (DEBUG) {
            console.error(error.response.data);
        }
        notify.destructive('Something went wrong!', {
            description: "Submission couldn't be created. Check your information and try again."
        })
    }

    const createMut = useMutation<AbstractSchema, AxiosError, AbstractSchema>({
        mutationFn: createSubmission,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abstract',], exact: false, }),
        onError: onError,

    })

    const updateMut = useMutation<AbstractSchema, AxiosError, UpdateParams>({
        mutationFn: updateSubmission,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abstract',] }),
        onError: onError,
    })

    const { control, handleSubmit, reset, formState: { isDirty, isSubmitting, isValid } } = useForm({
        resolver: zodResolver(abstractSchema),
        mode: 'onChange',
        defaultValues: {
            is_for_young_watoc: false,
            presentation_type: null,
            references: '',
            title: '',
            text: '',
        },
    })

    const isForYoungWatoc = useWatch({
        name: 'is_for_young_watoc',
        control,
    })

    const onFormSubmit = handleSubmit(
        async (data) => {
            if (abstractId === null) {
                const abstract = await createMut.mutateAsync(data)
                notify.success('Submission created successfully!', {
                    description: (
                        <p>The submission <strong dangerouslySetInnerHTML={{ __html: abstract.title }} /> was saved in the system.</p>
                    )
                })
                reset()
                return
            }
            await updateMut.mutateAsync({ id: abstractId, data })
            notify.success('Submission saved successfully!', {
                description: (
                    <p>The submission <strong dangerouslySetInnerHTML={{ __html: abstract.title }} /> was updated.</p>
                )
            })
        },
        async (data) => {
            if (DEBUG) {
                console.error(data)
            }
        }
    )

    useEffect(() => {
        if (abstractId === null) {
            reset({
                is_for_young_watoc: false,
                presentation_type: null,
                references: '',
                title: '',
                text: '',
            })
        }
        else if (abstract) {
            reset({
                is_for_young_watoc: abstract.is_for_young_watoc,
                presentation_type: abstract.presentation_type,
                title: abstract.title,
                references: abstract.references,
                text: abstract.text,
            })
        }

    }, [abstract])

    const formDisabled = isSubmitting || createMut.isPending || updateMut.isPending

    return (
        <form onSubmit={onFormSubmit} id='abstract-submission-form' className='space-y-5'>
            <fieldset disabled={formDisabled} className='space-y-8'>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel className="text-lg" htmlFor={field.name}>Abstract title</FieldLabel>
                            <FieldDescription className='max-sm:text-xs'>
                                Provide a concise, descriptive title (maximum 20 words). Please do not include author names, affiliations, or other identifying information.
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                title='Abstract title'
                                invalid={fieldState.invalid}
                                id={field.name}
                                addonsOptions={{
                                    bold: false,
                                    italic: false,
                                    underline: false,
                                }}
                                multiline={false}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="wrap-anywhere text-xl tracking-wide! font-medium"
                                maxLength={3500}
                                footer={
                                    <InputGroupText className={'w-full min-h-5 flex flex-col gap-0 md:flex-row'}>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}

                                        <FieldLabel htmlFor={field.name} className={cn(
                                            'font-normal ml-auto',
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 20) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/20 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                        </Field>
                    )}
                />
                <FieldSet>
                    <FieldLegend className="text-lg">Presentation Format</FieldLegend>
                    <FieldGroup>
                        <Controller
                            name="is_for_young_watoc"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                    <Checkbox
                                        id={field.name}
                                        name={field.name}
                                        aria-invalid={fieldState.invalid}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="size-5"
                                    />
                                    <FieldContent>
                                        <FieldLabel className="font-normal cursor-pointer" htmlFor={field.name}>
                                            Submit for Young WATOC
                                        </FieldLabel>
                                    </FieldContent>
                                </Field>
                            )}
                        />

                        <AnimatePresence mode="wait" initial={false}>
                            {isForYoungWatoc ? (
                                <motion.div
                                    key="young-watoc-desc"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <FieldDescription>
                                        This submission is for the Young WATOC 2028
                                    </FieldDescription>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="presentation-type-select"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <Controller
                                        name="presentation_type"
                                        defaultValue="oral"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field orientation="responsive" data-invalid={fieldState.invalid} className="pt-2">
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
                                                        {presentationTypes.map((item) => (
                                                            <SelectItem key={item.value} value={item.value}>
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldDescription className="max-sm:text-xs">
                                                    Select the preferred format for presenting your work.
                                                </FieldDescription>
                                            </Field>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </FieldGroup>
                </FieldSet>
                <Controller
                    name="text"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-lg" htmlFor={field.name}>Abstract text</FieldLabel>
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
                                    <InputGroupText className={'w-full min-h-5 flex flex-col gap-0 md:flex-row'}>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            'font-normal ml-auto',
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/350 words
                                        </FieldLabel>
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
                            <FieldLabel className="text-lg" htmlFor={field.name}>References</FieldLabel>
                            <FieldDescription className='max-sm:text-xs'>
                                References are required, and must not exceed 350 words.
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
                                    <InputGroupText className={'w-full min-h-5 flex flex-col gap-0 md:flex-row'}>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            'font-normal ml-auto',
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/350 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                        </Field>
                    )}
                />

                <div className={"flex w-fit items-center gap-3 ml-auto"}>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={!isDirty || formDisabled}
                    >
                        <RotateCcw className='text-muted-foreground' /> Reset
                    </Button>

                    <Button
                        type="submit"
                        form="abstract-submission-form"
                        disabled={!isValid || !isDirty || formDisabled}
                    >
                        {formDisabled ? (
                            <Fragment>
                                <Spinner />
                                <span>Saving...</span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Upload />
                                <span>Save Submission</span>
                            </Fragment>
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default AbstractContentForm