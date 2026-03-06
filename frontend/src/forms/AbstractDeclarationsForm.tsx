import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useFetch } from '@/hooks/use-fetch'
import { type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'


type AbstractFormProps = {
    onSubmit?: () => Promise<void> | void
}

function AbstractDeclarations({ onSubmit }: AbstractFormProps) {
    const { id } = useParams()
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        // resolver: zodResolver(abstractDeclarationSchema),
        mode: 'onChange',
        defaultValues: {
            commitment_attendance: false,
            confirm_accuracy: false,
            consent_publication: false,
            no_ai_used: false,
            not_previously_published: false,
            submit_on_behalf: false,
        }
    })

    const {
        data: declarationsData,
        fetchData: fetchDeclarations
    } = useFetch<AbstractDeclarationValues>(`/abstracts/${id}/declarations/`)

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            const res = await axiosClient.patch(`/abstracts/${id}/declarations/`, {
                ...data, abstract_id: id
            })
            if (import.meta.env.DEV) {
                console.log(res.data);
            }
            await fetchDeclarations()
            await onSubmit?.()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    })

    useEffect(() => {
        if (declarationsData) {
            reset(declarationsData)
        }
    }, [declarationsData])

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset className='space-y-5'>
                <Controller
                    name="confirm_accuracy"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        1. I confirm that the abstract and all entered information is correct:
                                    </FieldTitle>
                                    <FieldDescription>
                                        I certify that the scientific content of this abstract and all submitted information is accurate and reflects the final intended presentation. I acknowledge that no changes can be made once the final submission deadline has passed.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />
                <Controller
                    name="consent_publication"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        2. The submission of an abstract constitutes your consent to publication:
                                    </FieldTitle>
                                    <FieldDescription>
                                        I hereby grant permission for this abstract to be published in the WATOC Congress, including the official website and promotional materials related to the scientific program.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />
                <Controller
                    name="submit_on_behalf"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        3. I confirm that I submit this abstract on behalf of all authors:
                                    </FieldTitle>
                                    <FieldDescription>
                                        I herewith confirm that the contact details saved in this system are those of the first author, who will be notified about the status of the abstract. The first author is responsible for informing the other authors about the status of the abstract.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />
                <Controller
                    name="commitment_attendance"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        4. The abstract submission constitutes a formal commitment by the first author to physically attend the Congress:
                                    </FieldTitle>
                                    <FieldDescription>
                                        I understand that submitting this abstract constitutes a formal commitment by the presenting author to register for and attend WATOC in person to deliver the presentation at the time and in the format (Oral or Poster) assigned by the Scientific Committee.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />
                <Controller
                    name="not_previously_published"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        5. I herewith confirm that the abstract has not been previously published:
                                    </FieldTitle>
                                    <FieldDescription>
                                        I confirm that this abstract presents original work and has not been previously published in a peer-reviewed journal or presented at another major international conference prior to WATOC.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />
                <Controller
                    name="no_ai_used"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldLabel htmlFor={field.name} className='cursor-pointer shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle className='text-base'>
                                        6. I herewith confirm that the abstract was prepared without using the aid of AI tools (such as, but not limited to, ChatGPT):
                                    </FieldTitle>
                                    <FieldDescription>
                                        I certify that this abstract is the original work of the listed authors. No artificial intelligence tools or automated text generators were used in the preparation of this scientific work.
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className='data-[state=checked]:bg-emerald-600 data-[state=checked]:scale-110'
                                />
                            </Field>
                        </FieldLabel>
                    )}
                />

                <div className='flex justify-end col-span-1 md:col-span-2'>
                    <Button type='submit' className='p-5 w-60 uppercase'>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save changes
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default AbstractDeclarations

const DeclarationItem = ({
    title,
    description,
    field,
    fieldState,
    index
}: {
    title: string;
    description: string;
    field: any;
    fieldState: any;
    index: number
}) => (
    <div className={`
        relative flex flex-row items-start space-x-4 space-y-0 rounded-xl border p-6 transition-all duration-200
        ${field.value ? 'bg-indigo-50/30 border-indigo-200 shadow-sm' : 'bg-background border-slate-200'}
        ${fieldState.invalid ? 'border-red-300 bg-red-50/20' : ''}
    `}>
        <div className="flex h-6 items-center">
            <Switch
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                className='data-[state=checked]:bg-indigo-600 scale-110'
            />
        </div>
        <div className="flex flex-col gap-1">
            <label
                htmlFor={field.name}
                className="text-base font-bold leading-tight cursor-pointer text-slate-800"
            >
                <span className="mr-2">{index}.</span>
                {title}
            </label>
            <p className="text-sm text-slate-500 leading-relaxed">
                {description}
            </p>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
    </div>
);