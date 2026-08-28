import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, } from "@/components/ui/combobox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useRegistrationStore } from '@/data/store'
import type { Tour } from '@/data/tours-data'
import { useFetch } from '@/hooks/use-fetch'
import { routes } from '@/routes/routes'
import { selectTourSchema, type SelectTourValues } from "@/schemas/select-tour-schema"
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'


export function SelectTourForm() {
    const { control, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<SelectTourValues>({
        resolver: zodResolver(selectTourSchema),
        defaultValues: {
            selectedTours: []
        }
    })

    const { data: tours, fetching: loading } = useFetch<Tour[]>('/tours')

    const onFormSubmit = handleSubmit(async (data) => {
        console.log(data);
        setData({ tour: data })
    })

    const wantTours = watch('willAssistTour')

    const navigate = useNavigate()
    const { setData, dinner, tour, fee } = useRegistrationStore()
    useEffect(() => {
        if (!useRegistrationStore.persist.hasHydrated) return
        if (!fee) {
            navigate(routes.users.confirmAssistance.fee)
            return
        } else if (!dinner) {
            navigate(routes.users.confirmAssistance.dinner)
            return
        } else if (tour) {
            reset(tour)
        }
    }, [useRegistrationStore.persist.hasHydrated, wantTours, loading, dinner, tour])


    return (
        <form id='select-tour-form' onSubmit={onFormSubmit}>
            <fieldset disabled={isSubmitting} className='space-y-10'>
                <Controller
                    name="willAssistTour"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend>Mayan Archaeological Tours</FieldLegend>
                            <FieldDescription>
                                Please indicate if you wish to participate in the Mayan Archaeological Tours in Yucatán.
                            </FieldDescription>
                            <RadioGroup
                                name={field.name}
                                value={String(field.value)}
                                onValueChange={(value) => field.onChange(value === 'true')}
                            >
                                {[
                                    { value: 'true', id: `${field.name}-true`, label: 'I will attend the Mayan Archaeological Tours.' },
                                    { value: 'false', id: `${field.name}-false`, label: 'Not attending.' },
                                ].map(i => (
                                    <Field
                                        key={i.value}
                                        orientation='horizontal'
                                        data-invalid={fieldState.invalid}
                                        className='gap-x-3 pl-3 rounded-md border border-transparent hover:bg-black/5 hover:border-input/50'
                                    >
                                        <RadioGroupItem
                                            value={i.value}
                                            id={i.id}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldLabel htmlFor={i.id} className='p-2 cursor-pointer'>
                                            <FieldTitle>
                                                {i.label}
                                            </FieldTitle>
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                />

                {wantTours && !loading && (
                    <>
                        <Separator className='my-7' />
                        <Controller
                            name="selectedTours"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLegend>
                                            Select Desired Tours
                                        </FieldLegend>
                                    </FieldContent>
                                    <Combobox
                                        multiple
                                        autoHighlight
                                        items={tours}
                                        defaultValue={[]}
                                        onValueChange={(values: Tour[]) => field.onChange(values.map(t => t.id))}
                                    >
                                        <ComboboxChips className="max-w-md" aria-invalid={fieldState.invalid}>
                                            <ComboboxValue placeholder='Select tours...'>
                                                {(values: Tour[]) => (
                                                    <React.Fragment>
                                                        {values.map((value) => (
                                                            <ComboboxChip key={value.id}>{value.name} </ComboboxChip>
                                                        ))}

                                                        <ComboboxChipsInput />
                                                    </React.Fragment>
                                                )}
                                            </ComboboxValue>
                                        </ComboboxChips>
                                        <ComboboxContent>
                                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item: Tour) => (
                                                    <ComboboxItem key={item.id} value={item}>
                                                        {item.name}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FieldContent>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                        <FieldDescription>
                                            See the available tours below.
                                        </FieldDescription>
                                    </FieldContent>
                                </Field>
                            )}
                        />
                    </>
                )}

                <Separator className='my-7' />
            </fieldset>

            <Button>
                {isSubmitting && (
                    <Spinner />
                )}
                Save
            </Button>

            <div className='grid grid-cols-3 gap-3 p-6'>
                {tours?.map((tour) => (
                    <Card
                        key={tour.id}
                        className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden"
                    >
                        <div className="absolute inset-0 aspect-video" />
                        <img
                            src={tour.image || ''}
                            alt="Event cover"
                            className="relative z-20 aspect-video w-full object-cover"
                        />
                        <CardHeader>
                            <CardAction>
                                <Badge variant="secondary">
                                    ${tour.price} MXN
                                </Badge>
                            </CardAction>
                            <CardTitle>
                                {tour.name}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <CardDescription>
                                {tour.description}
                            </CardDescription>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </form>
    )

}

