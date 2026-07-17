import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel, } from '@/components/ui/field'
import { Item } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { abstractDeclarationSchema, type AbstractDeclarationValues, } from '@/schemas/abstract-declaration-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { HardDriveDownload, RotateCcw, } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'


function AbstractDeclarations() {
    const { id } = useParams()

    const { data: declarationsData } = useQuery<AbstractDeclarationValues>({
        queryKey: ['abstract', 'declarations', id],
        queryFn: async () => {
            const { data } = await axiosClient.get(`/abstracts/submissions/${id}/declarations/`)
            return data
        }
    })

    const queryClient = useQueryClient()

    const patchMutation = useMutation({
        mutationFn: async (data: AbstractDeclarationValues) => {
            const res = await axiosClient.patch(`/abstracts/submissions/${id}/declarations/`, data)
            if (import.meta.env.DEV) {
                console.log('Success:', res.data);
            }
        },
        onError: (error) => {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['abstract', 'declarations', id],
            })
        }
    })

    const { control, getValues, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<AbstractDeclarationValues>({
        resolver: zodResolver(abstractDeclarationSchema),
        mode: 'onChange',
        defaultValues: {
            abstract_id: Number(id),
            commitment_attendance: false,
            confirm_accuracy: false,
            consent_publication: false,
            no_ai_used: false,
            not_previously_published: false,
            submit_on_behalf: false,
        }
    })

    const onFormSubmit = handleSubmit(async data => patchMutation.mutate({ ...data }), error => console.error(error))

    useEffect(() => {
        if (declarationsData) {
            reset(declarationsData)
        }
    }, [declarationsData, reset])

    return (
        <form onSubmit={onFormSubmit} id='abstract-declarations-form' className='max-w-full py-8 space-y-8'>
            <FieldDescription>
                Before submitting your abstract, please read each declaration carefully and confirm your agreement. These declarations ensure that your submission meets the scientific, ethical, and publication requirements established by WATOC 2028.
            </FieldDescription>


            <fieldset disabled={isSubmitting} className='space-y-4'>
                <Controller
                    name="confirm_accuracy"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I certify that the scientific content of this abstract and all submitted information is accurate and reflects the final intended presentation. I acknowledge that no changes can be made once the final submission deadline has passed.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />

                <Controller
                    name="consent_publication"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I hereby grant permission for this abstract to be published in the WATOC Congress, including the official website and promotional materials related to the scientific program.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />

                <Controller
                    name="submit_on_behalf"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I hereby grant permission for this abstract to be published in the WATOC Congress, including the official website and promotional materials related to the scientific program.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />

                <Controller
                    name="commitment_attendance"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I understand that submitting this abstract constitutes a formal commitment by the presenting author to register for and attend WATOC in person to deliver the presentation at the time and in the format (Oral or Poster) assigned by the Scientific Committee.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />

                <Controller
                    name="not_previously_published"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I confirm that this abstract presents original work and has not been previously published in a peer-reviewed journal or presented at another major international conference prior to WATOC.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />

                <Controller
                    name="no_ai_used"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Item
                                variant="outline"
                                className={cn(
                                    "group p-5 pb-0 border-2 border-border rounded-md transition-colors duration-300",
                                    "hover:shadow-md",
                                    "flex items-start gap-5",
                                    fieldState.invalid ? "border-destructive bg-destructive/5" : "hover:border-primary-light"
                                )}
                            >
                                <FieldLabel htmlFor={field.name} className="flex-1 block min-w-0 cursor-pointer">
                                    <FieldDescription>
                                        I certify that this abstract is the original work of the listed authors. No artificial intelligence tools or automated text generators were used in the preparation of this scientific work.
                                    </FieldDescription>

                                    <div className={cn(
                                        "overflow-hidden transition-all h-6 duration-200 ease-in-out my-2",
                                        fieldState.invalid ? "opacity-100" : " opacity-0"
                                    )}>
                                        <FieldError errors={[fieldState.error]} />
                                    </div>
                                </FieldLabel>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="shrink-0 self-start data-[state=checked]:bg-primary-main data-[state=checked]:scale-110"
                                />
                            </Item>
                        </Field>
                    )}
                />
            </fieldset>

            <div className="sticky bottom-20 z-20">
                <Item
                    variant="outline"
                    className={cn(
                        "group p-3 border-2 border-border rounded-md transition-colors duration-300",
                        "hover:shadow-md hover:border-primary-light",
                        "ml-auto flex flex-col md:flex-row w-fit items-center gap-3 rounded-xl shadow-md",
                        (!isDirty && !isSubmitting) ? 'bg-background/70' : 'bg-background'
                    )}
                >

                    {!isDirty && !isSubmitting ? (
                        <span className="text-sm text-muted-foreground">
                            No unsaved changes
                        </span>
                    ) : (
                        <span className="text-sm">
                            You have unsaved changes
                        </span>
                    )}

                    <div className='space-x-3'>
                        <Button type="submit" form='abstract-declarations-form' disabled={!isDirty || isSubmitting}>
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

                        <Button
                            variant='outline'
                            type='button'
                            onClick={() => reset()}
                            disabled={!isDirty || isSubmitting}
                        >
                            <RotateCcw className='text-muted-foreground' /> Reset
                        </Button>
                    </div>
                </Item>
            </div>
        </form>
    )
}

export default AbstractDeclarations