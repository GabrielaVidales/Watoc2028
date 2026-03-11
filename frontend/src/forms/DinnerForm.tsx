import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { dietaryNeedsList, dietaryRestrictionsForm, foodAllergyList } from '@/schemas/dinner- schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

function DinnerForm() {
    const { handleSubmit, watch, getValues, formState, control } = useForm({
        resolver: zodResolver(dietaryRestrictionsForm),
        mode: 'onSubmit',
        defaultValues: {
            dietaryNeeds: [],
            foodAllergies: [],
            otherAllergies: '',
            otherDietaryNeeds: '',
        }
    })

    const { isValid, isSubmitting } = formState

    const onFormSubmit = handleSubmit(async (data) => {
        await new Promise(r => setTimeout(r, 1000))
        if (import.meta.env.DEV) {
            console.log(data);
        }

    }, async (invalid) => {
        if (import.meta.env.DEV) {
            console.log(invalid);
            console.log(getValues());
        }
    })

    const willAttend = watch('willAssistDinner')
    const hasDietaryRestriction = watch('hasDietaryRestriction')
    const restrictions = watch('dietaryNeeds')
    const hasFoodAllergy = watch('hasFoodAllergy')
    const allergies = watch('foodAllergies')

    return (
        <form onSubmit={onFormSubmit} id='dinner-form'>
            <fieldset disabled={isSubmitting} className='space-y-10'>
                <Controller
                    name={'willAssistDinner'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet className='gap-2'>
                            <FieldLegend variant='label' className='mb-1'>Congress Dinner Attendance</FieldLegend>
                            <FieldDescription className='space-y-1'>
                                Please indicate if you wish to attend the Congress Dinner on Day, ## January 2028.
                            </FieldDescription>
                            <RadioGroup
                                name={field.name}
                                value={String(field.value)}
                                onValueChange={(value) => field.onChange(value === 'true')}
                            >
                                {[{
                                    id: 1,
                                    title: 'Yes, I will attend',
                                    value: true
                                }, {
                                    id: 2,
                                    title: 'No, I will not attend',
                                    value: false
                                }].map((plan) => (
                                    <FieldLabel key={plan.id} htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <RadioGroupItem
                                                value={`${plan.value}`}
                                                id={`${field.name}-${plan.id}`}
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <FieldContent>
                                                <FieldTitle>{plan.title}</FieldTitle>
                                            </FieldContent>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                />

                {willAttend && (<>
                    <Controller
                        name={'hasDietaryRestriction'}
                        control={control}
                        shouldUnregister
                        render={({ field, fieldState }) => (
                            <FieldSet className='gap-2'>
                                <FieldLegend variant='label' className='mb-1'>Dietary Restrictions</FieldLegend>
                                <FieldDescription className='space-y-1'>
                                    If you are attending the Congress Dinner, please inform us of any dietary restrictions.
                                </FieldDescription>
                                <RadioGroup
                                    name={field.name}
                                    value={String(field.value)}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                >
                                    {[{
                                        id: 1,
                                        title: 'Yes, I have dietary restrictions',
                                        value: true
                                    }, {
                                        id: 2,
                                        title: 'No, I do not have dietary restrictions',
                                        value: false
                                    }].map((plan) => (
                                        <FieldLabel key={plan.id} htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <RadioGroupItem
                                                    value={`${plan.value}`}
                                                    id={`${field.name}-${plan.id}`}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <FieldContent>
                                                    <FieldTitle>{plan.title}</FieldTitle>
                                                </FieldContent>
                                            </Field>
                                        </FieldLabel>
                                    ))}
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldSet>
                        )}
                    />

                    {hasDietaryRestriction && (<>
                        <Controller
                            name="dietaryNeeds"
                            control={control}
                            shouldUnregister
                            render={({ field, fieldState }) => (
                                <FieldSet>
                                    <FieldLegend variant="label">Specific Dietary Restrictions</FieldLegend>
                                    <FieldDescription>
                                        Please select all that apply. This information will be used to ensure your meal requirements are met during the event.
                                    </FieldDescription>
                                    <FieldGroup data-slot="checkbox-group">
                                        {dietaryNeedsList.map((task) => (
                                            <Field
                                                key={task.value}
                                                orientation="horizontal"
                                                data-invalid={fieldState.invalid}
                                            >
                                                <Checkbox
                                                    id={`${field.name}-${task.value}`}
                                                    name={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    checked={field.value?.includes(task.value)}
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked
                                                            ? [...field.value, task.value]
                                                            : field.value.filter((value) => value !== task.value)
                                                        field.onChange(newValue)
                                                    }}
                                                />
                                                <FieldLabel
                                                    htmlFor={`${field.name}-${task.value}`}
                                                    className="font-normal cursor-pointer"
                                                >
                                                    {task.label}
                                                </FieldLabel>
                                            </Field>
                                        ))}
                                    </FieldGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldSet>
                            )}
                        />

                        {restrictions?.includes('other') && (
                            <Controller
                                name="otherDietaryNeeds"
                                control={control}
                                shouldUnregister
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Please specify your restrictions</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your awesome title..."
                                            maxLength={75}
                                            autoComplete="off"
                                        />
                                        <FieldDescription>
                                            Provide brief details about any other dietary needs not listed above.
                                        </FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        )}
                    </>)}

                    <Controller
                        name={'hasFoodAllergy'}
                        control={control}
                        shouldUnregister
                        render={({ field, fieldState }) => (
                            <FieldSet className='gap-2'>
                                <FieldLegend variant='label' className='mb-1'>Food Allergies</FieldLegend>
                                <FieldDescription className='space-y-1'>
                                    Please indicate if you have any food allergies we should be aware of for meal catering.
                                </FieldDescription>
                                <RadioGroup
                                    name={field.name}
                                    value={String(field.value)}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                >
                                    {[{
                                        id: 1,
                                        title: 'Yes, I have food allergies',
                                        value: true
                                    }, {
                                        id: 2,
                                        title: 'No, I do not have food allergies',
                                        value: false
                                    }].map((plan) => (
                                        <FieldLabel key={plan.id} htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <RadioGroupItem
                                                    value={`${plan.value}`}
                                                    id={`${field.name}-${plan.id}`}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <FieldContent>
                                                    <FieldTitle>{plan.title}</FieldTitle>
                                                </FieldContent>
                                            </Field>
                                        </FieldLabel>
                                    ))}
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldSet>
                        )}
                    />

                    {hasFoodAllergy && (<>
                        <Controller
                            name="foodAllergies"
                            control={control}
                            shouldUnregister
                            render={({ field, fieldState }) => (
                                <FieldSet>
                                    <FieldLegend variant="label">Specify Food Allergies</FieldLegend>
                                    <FieldDescription>
                                        Please select all the food allergies that apply to you.
                                    </FieldDescription>
                                    <FieldGroup data-slot="checkbox-group">
                                        {foodAllergyList.map((task) => (
                                            <Field
                                                key={task.value}
                                                orientation="horizontal"
                                                data-invalid={fieldState.invalid}
                                            >
                                                <Checkbox
                                                    id={`${field.name}-${task.value}`}
                                                    name={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    checked={field.value?.includes(task.value)}
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked
                                                            ? [...field.value, task.value]
                                                            : field.value.filter((value) => value !== task.value)
                                                        field.onChange(newValue)
                                                    }}
                                                />
                                                <FieldLabel
                                                    htmlFor={`${field.name}-${task.value}`}
                                                    className="font-normal"
                                                >
                                                    {task.label}
                                                </FieldLabel>
                                            </Field>
                                        ))}
                                    </FieldGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldSet>
                            )}
                        />

                        {allergies?.includes('other') && (
                            <Controller
                                name="otherAllergies"
                                control={control}
                                shouldUnregister
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Other Food Allergies</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your awesome title..."
                                            maxLength={100}
                                            autoComplete="off"
                                        />
                                        <FieldDescription>
                                            Provide details for any allergies not covered in the list above.
                                        </FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        )}
                    </>)}
                </>)}

                <div className='flex flex-col items-end gap-3 w-full'>
                    <Button type='submit' className='p-5 w-60 uppercase' disabled={!isValid}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save preferences
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default DinnerForm