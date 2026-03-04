import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useFetch } from '@/hooks/use-fetch'
import { abstractDeclaration, type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'


type AbstractFormProps = {
    abstractId?: number,
    onSubmit?: () => Promise<void> | void
}

function AbstractDeclarations({ abstractId }: AbstractFormProps) {

    const { data: declarationsData, fetchData: fetchDeclarations } = useFetch<AbstractDeclarationValues>(`/abstracts/${abstractId}/declarations/`)

    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm({
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

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                ...data,
                abstract_id: abstractId || null
            }
            console.log(payload);

            const res = await axiosClient.patch(`/abstracts/${abstractId}/declarations/`, payload)
            console.log(res.data);

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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
                                        2. The submission of an abstract constitutes your consent to publication
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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
                                        4. The abstract submission constitutes a formal commitment by the first author to physically attend the Congress
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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
                                        5. I herewith confirm that the abstract has not been previously published.
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
                        <FieldLabel htmlFor={field.name} className='border-l-8! border-l-black shadow-md'>
                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldTitle>
                                        6. I herewith confirm that the abstract was prepared without using the aid of AI tools (such as, but not limited to, ChatGPT).:
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