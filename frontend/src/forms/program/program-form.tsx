import { DatePicker } from '@/components/custom/datetime-popover'
import MultipleInput from '@/components/custom/multiple-input'
import { SelectAbstract, SelectUser } from '@/components/custom/select-user'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from "@/lib/utils"
import type { AbstractDTO } from '@/schemas/abstracts/abstract-schemas'
import { scheduledEventFormSchema, type ScheduleEventFormInputValues, type ScheduleEventFormOutputValues } from '@/schemas/program/program-schema'
import type { UserSchema } from '@/schemas/user-schemas'
import { createScheduledEvent, getScheduledEvent } from "@/services/program/program-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { ClockIcon, RotateCcwIcon, UploadIcon } from 'lucide-react'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

const resourceTypes = [
    {
        id: 0,
        value: 'abstract',
        label: 'Abstract Submission'
    },
    {
        id: 1,
        value: 'user',
        label: 'Speaker'
    },
] as const


const defaultValues: ScheduleEventFormInputValues = {
    id: null,
    title: 'Title',
    description: 'Description',
    lounge: 'Sala Uxmal',
    tags: [],
    date: new Date(),
    end_time: '00:00',
    start_time: '00:00',
    resource_id: null,
    resource_type: 'abstract',
}

export function ProgramForm({ eventId }: { eventId: number }) {
    const { data, isLoading } = useQuery({
        queryKey: ['scheduledEvent', eventId],
        queryFn: () => getScheduledEvent<any>(eventId),
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!eventId,
    })

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        formState: {
            isValid,
            isSubmitting,
            isDirty,
        }
    } = useForm<ScheduleEventFormInputValues, any, ScheduleEventFormOutputValues>({
        resolver: zodResolver(scheduledEventFormSchema),
        mode: 'onChange',
        defaultValues
    })

    const onFormSubmit = handleSubmit(
        async (data) => {
            console.log(data);

            try {

                const response = await createScheduledEvent(data)
                console.log(response);
            } catch (error) {
                console.log(error.response.data);

            }



        },
        invalidData => console.log(invalidData)
    )

    const [resource, setResource] = useState<UserSchema | AbstractDTO>(null)

    const resourceType = useWatch({
        control,
        name: 'resource_type'
    })

    const formDisabled = isLoading || isSubmitting

    useEffect(() => {
        if (data) {
            setResource(data.resource.object)
            reset({
                id: data.id,
                title: data.title,
                description: data.description,
                lounge: data.lounge,
                tags: data.tags,
                resource_type: data.resource.type,
                resource_id: data.resource.object.id
            })

        } else {
            setResource(null)
            reset(defaultValues)
        }
    }, [reset, data])

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset className="space-y-4" disabled={formDisabled}>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    maxLength={101}
                                />
                                <InputGroupAddon align="inline-end">
                                    <FieldLabel htmlFor={field.name} className={cn(
                                        "ml-auto", (fieldState.invalid || (field?.value?.length || 0) > 100) && 'text-destructive'
                                    )}>
                                        {(field?.value?.length || 0)}/100
                                    </FieldLabel>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError allocateLayout errors={[fieldState.error]} />
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    maxLength={151}
                                    autoComplete="off"
                                    className="min-h-10 max-h-30 break-all"
                                />
                                <InputGroupAddon align="block-end" className="cursor-default py-2">
                                    <FieldLabel htmlFor={field.name} className={cn(
                                        "ml-auto", (fieldState.invalid || (field?.value?.length || 0) > 150) && 'text-destructive'
                                    )}>
                                        {(field?.value?.length || 0)}/150
                                    </FieldLabel>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError allocateLayout errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className='flex flex-col md:flex-row gap-2 w-full'>
                    <Controller
                        name={'resource_type'}
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="form-select-nationality">
                                        Resource type
                                    </FieldLabel>
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={(option) => {
                                        setValue('resource_id', null)
                                        setResource(null)
                                        field.onChange(option)
                                    }}
                                >
                                    <SelectTrigger
                                        id="form-select-nationality"
                                        aria-invalid={fieldState.invalid}
                                        className='h-12!'
                                    >
                                        <SelectValue placeholder="Select an option..." />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {resourceTypes.map(item => (
                                            <SelectItem value={item.value as string} key={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                    <Controller
                        name={'resource_id'}
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-select-nationality">
                                    Resource
                                </FieldLabel>

                                {resourceType === 'user' ? (
                                    <SelectUser
                                        {...field}
                                        className='border-input'
                                        invalid={fieldState.invalid}
                                        value={resource as UserSchema}
                                        onChange={user => {
                                            setResource(user)
                                            field.onChange(user?.id || null)
                                        }}
                                    />
                                ) : resourceType === 'abstract' && (
                                    <SelectAbstract
                                        {...field}
                                        className='border-input'
                                        invalid={fieldState.invalid}
                                        value={resource as AbstractDTO}
                                        onChange={user => {
                                            setResource(user)
                                            field.onChange(user?.id || null)
                                        }}
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Select a Date</FieldLabel>
                            <DatePicker
                                {...field}
                                presets={[
                                    {
                                        label: 'Today',
                                        days: 0,
                                    },
                                    {
                                        label: 'January',
                                        days: 0,
                                        date: new Date(2028, 0, 9)
                                    },
                                ]}
                            />
                            <FieldError allocateLayout errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className='flex flex-col sm:flex-row gap-4'>
                    <Controller
                        name="start_time"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='w-full'>
                                <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        type='time'
                                        id={field.name}
                                        step='60'
                                        className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>
                                            <FieldLabel htmlFor={field.name} className={cn(
                                                (fieldState.invalid || (field?.value?.length || 0) > 100) && 'text-destructive'
                                            )}>
                                                <ClockIcon className='' />
                                            </FieldLabel>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldError allocateLayout errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        name="end_time"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className='w-full'>
                                <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        type='time'
                                        id={field.name}
                                        step='60'
                                        className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>
                                            <FieldLabel htmlFor={field.name} className={cn(
                                                (fieldState.invalid || (field?.value?.length || 0) > 100) && 'text-destructive'
                                            )}>
                                                <ClockIcon className='' />
                                            </FieldLabel>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldError allocateLayout errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="tags"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                            <MultipleInput
                                {...field}
                                maxLength={30}
                                aria-invalid={fieldState.invalid}
                                maxValues={8}
                                value={field.value.map(v => v.description)}
                                onChange={tags => {
                                    field.onChange(tags.map(t => ({ description: t })))
                                }}
                            />
                            <FieldError allocateLayout errors={[fieldState.error]} />
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
                        <RotateCcwIcon className='text-muted-foreground' /> Reset
                    </Button>

                    <Button
                        type="submit"
                        form="edit-participant-form"
                        disabled={!isValid}
                        onClick={onFormSubmit}
                    >
                        {formDisabled ? (
                            <Fragment>
                                <Spinner />
                                <span>{isLoading ? 'Loading...' : 'Saving...'}</span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <UploadIcon />
                                <span>{(isDirty && isValid) ? 'Save changes' : 'No Changes'}</span>
                            </Fragment>
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default ProgramForm