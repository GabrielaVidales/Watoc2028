import { notify } from '@/components/custom/notify'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { InputGroupText } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { type AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { editAbstractSchema, type EditAbstractFormValues } from '@/schemas/abstracts/edit-abstract-schema'
import { createSubmission, getSubmissionById, updateSubmission, type UpdateParams } from '@/services/submissions/submission-services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ChartColumnIncreasingIcon, LightbulbIcon, RotateCcw, SparklesIcon, Upload } from 'lucide-react'
import { Fragment, useEffect, } from 'react'
import { Controller, useForm } from 'react-hook-form'


const presentationOptions = [
    {
        value: "oral",
        id: "oral",
        title: "Oral Presentation",
        description: "Present your research orally during the congress.",
        icon: LightbulbIcon,
    },
    {
        value: "poster",
        id: "poster",
        title: "Poster",
        description: "Present your research as a scientific poster.",
        icon: ChartColumnIncreasingIcon,
    },
    {
        value: "youngWatoc",
        id: "youngWatoc",
        title: "Young WATOC",
        description: "Submit your work to the Young WATOC program.",
        icon: SparklesIcon,
    },
] as const


type AbstractFormProps = {
    abstractId?: number | null,
}


function AbstractContentForm({ abstractId = null }: AbstractFormProps) {
    const queryClient = useQueryClient()

    const { data: abstract } = useQuery<AbstractSchema>({
        refetchOnWindowFocus: false,
        enabled: abstractId !== null,
        queryKey: ['abstract', abstractId],
        queryFn: async () => await getSubmissionById(abstractId),
    })

    const onError = (error: AxiosError) => {
        DEBUG && console.error(error.response.data);
        notify.destructive('Something went wrong!', {
            description: "Submission couldn't be created. Check your information and try again."
        })
    }

    const createMut = useMutation<AbstractSchema, AxiosError, AbstractSchema>({
        mutationFn: createSubmission,
        onError: onError,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstract',],
                exact: false,
            })
            notify.success('Submission created successfully!', {
                description: (
                    <p>The submission <strong dangerouslySetInnerHTML={{ __html: abstract.title }} /> was saved in the system.</p>
                )
            })
            reset()
        },

    })

    const updateMut = useMutation<AbstractSchema, AxiosError, UpdateParams>({
        mutationFn: updateSubmission,
        onError: onError,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstract',],
            })
            notify.success('Submission saved successfully!', {
                description: (
                    <p>The submission <strong dangerouslySetInnerHTML={{ __html: abstract.title }} /> was updated.</p>
                )
            })
            reset()
        },
    })

    const {
        reset,
        control,
        handleSubmit,
        formState: {
            isDirty,
            isSubmitting,
            isValid,
        }
    } = useForm<EditAbstractFormValues, any, AbstractSchema>({
        resolver: zodResolver(editAbstractSchema),
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
            if (abstractId === null) {
                createMut.mutate(data)
                return
            }

            updateMut.mutate({ id: abstractId, data })
        },
        async (data) => DEBUG && console.error(data)
    )

    useEffect(() => {
        if (abstractId === null) {
            reset({
                id: null,
                presentation_type: null,
                references: '',
                title: '',
                text: '',
            })
        }
        else if (abstract) {
            const presentationType: EditAbstractFormValues['presentation_type'] =
                abstract.presentation_type === ''
                    ? 'youngWatoc'
                    : abstract.presentation_type

            reset({
                id: abstract.id,
                presentation_type: presentationType,
                references: abstract.references,
                title: abstract.title,
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
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
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
                <Separator />
                <Controller
                    name="presentation_type"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend className="text-sm" variant='label'>Presentation Format</FieldLegend>
                            <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3"
                            >
                                {presentationOptions.map(item => (
                                    <FieldLabel
                                        key={item.id}
                                        htmlFor={item.id}
                                        className={cn(
                                            "cursor-pointer border-2! border-input/50",
                                            "hover:border-primary-light",
                                            "has-data-[state=checked]:border-primary-main",
                                            "has-data-[state=checked]:bg-primary-main/10!",
                                            "transition-all duration-150 hover:-translate-y-1 hover:shadow-md",
                                            fieldState.invalid && "border-destructive! hover:border-destructive! bg-destructive/5 has-data-[state=checked]:bg-destructive/10!",
                                        )}
                                    >
                                        <Field
                                            data-invalid={fieldState.invalid}
                                            orientation="vertical"
                                        >
                                            <div className="relative flex items-start justify-between gap-3">
                                                <FieldContent>
                                                    <FieldTitle className={cn(
                                                        "font-semibold mb-2",
                                                        fieldState.invalid
                                                            ? 'text-destructive'
                                                            : 'text-primary-main dark:text-white',
                                                    )}>
                                                        {item.title}
                                                    </FieldTitle>

                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className={cn(
                                                            "flex size-10 shrink-0 items-center justify-center rounded-xl border-2",
                                                            fieldState.invalid
                                                                ? "border-destructive bg-destructive/10"
                                                                : "border-primary-main/20 bg-primary-light/20",
                                                        )}>
                                                            <item.icon className={cn(
                                                                fieldState.invalid
                                                                    ? 'text-destructive'
                                                                    : 'text-primary-main',
                                                            )} />
                                                        </div>
                                                        <FieldContent>
                                                            <FieldDescription className="text-xs text-accent-foreground">
                                                                {item.description}
                                                            </FieldDescription>
                                                        </FieldContent>
                                                    </div>
                                                </FieldContent>
                                                <RadioGroupItem className='absolute top-0 right-0' value={item.value} id={item.id} />
                                            </div>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>
                        </FieldSet>
                    )}
                />
                <Separator />
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
                <Separator />
                <Controller
                    name="references"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>References</FieldLabel>
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