import { Button } from '@/components/ui/button'
import { CheckboxCard, CheckboxCardGroup } from '@/components/ui/checkbox-card-group'
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { useRegistrationStore } from '@/data/store'
import { dietaryNeedsList, dinnerAssistanceSchema, foodAllergyList } from '@/features/participants/schemas/dinner-schema'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCcwIcon, UploadIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'


function DinnerForm() {
    const { handleSubmit, watch, getValues, reset, control, formState: { isValid, isSubmitting },  } = useForm({
        resolver: zodResolver(dinnerAssistanceSchema),
        mode: 'onChange',
        defaultValues: {
            dietaryNeeds: [],
            foodAllergies: [],
            otherAllergies: '',
            otherDietaryNeeds: '',
        }
    })

    const willAttend = watch('willAssistDinner')
    const hasDietaryRestriction = watch('hasDietaryRestriction')
    const restrictions = watch('dietaryNeeds')
    const hasFoodAllergy = watch('hasFoodAllergy')
    const allergies = watch('foodAllergies')

    const onFormSubmit = handleSubmit(async (data) => {
        DEBUG && console.log(data);
        setData({ dinner: data })
    }, async (invalid) => {
        DEBUG && console.log(invalid, getValues());
    })

    const { dinner, setData } = useRegistrationStore()

    useEffect(() => {
        if (!useRegistrationStore.persist.hasHydrated) return

        if (dinner) {
            reset(dinner)
        }

    }, [useRegistrationStore.persist.hasHydrated, dinner])

    return (
        <form onSubmit={onFormSubmit} id='dinner-form'>
            <fieldset disabled={isSubmitting}>
                <Controller
                    name={'willAssistDinner'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend variant='label'>Congress Dinner Attendance</FieldLegend>
                            <FieldDescription>
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
                                    <Field key={plan.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <RadioGroupItem
                                            value={`${plan.value}`}
                                            id={`${field.name}-${plan.id}`}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldLabel htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                            <FieldTitle>{plan.title}</FieldTitle>
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                />

                <AnimatePresence>
                    {willAttend && (
                        <motion.div
                            key={'will-assist'}
                            initial={{ opacity: 0, height: 0, scale: 0.5 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className='overflow-hidden'
                        >
                            <div className='h-5' />

                            <section className='bg-secondary/50 p-6 rounded-lg border'>
                                <Controller
                                    name={'hasDietaryRestriction'}
                                    control={control}
                                    shouldUnregister
                                    render={({ field, fieldState }) => (
                                        <FieldSet>
                                            <FieldLegend variant='label'>Dietary Restrictions</FieldLegend>
                                            <FieldDescription>
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
                                                    <Field key={plan.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                        <RadioGroupItem
                                                            value={`${plan.value}`}
                                                            id={`${field.name}-${plan.id}`}
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        <FieldLabel htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                                            <FieldTitle>{plan.title}</FieldTitle>
                                                        </FieldLabel>
                                                    </Field>
                                                ))}
                                            </RadioGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldSet>
                                    )}
                                />

                                <AnimatePresence>
                                    {hasDietaryRestriction && (
                                        <motion.div
                                            key={'dietary-restriction'}
                                            initial={{ opacity: 0, height: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.5 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className='overflow-hidden p-1'
                                        >
                                            <div className='h-8' />
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
                                                        <CheckboxCardGroup
                                                            name={field.name}
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            invalid={fieldState.invalid}
                                                        >
                                                            {dietaryNeedsList.map((item) => (
                                                                <CheckboxCard
                                                                    key={item.id}
                                                                    value={item.value}
                                                                    title={item.label}
                                                                    icon={<item.icon />}
                                                                    invalid={fieldState.invalid}
                                                                    disabled={field.disabled}
                                                                />
                                                            ))}
                                                        </CheckboxCardGroup>
                                                        <FieldError errors={[fieldState.error]} />
                                                    </FieldSet>
                                                )}
                                            />

                                            <AnimatePresence>
                                                {restrictions?.includes('other') && (
                                                    <motion.div
                                                        key={'other-restriction'}
                                                        initial={{ opacity: 0, height: 0, }}
                                                        animate={{ opacity: 1, height: 'auto', }}
                                                        exit={{ opacity: 0, height: 0, }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className='overflow-hidden p-1'
                                                    >
                                                        <div className='h-8' />

                                                        <Controller
                                                            name="otherDietaryNeeds"
                                                            control={control}
                                                            shouldUnregister
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor={field.name}>Please specify your restrictions</FieldLabel>
                                                                    <FieldDescription>
                                                                        Provide brief details about any other dietary needs not listed above. {`${fieldState.invalid}`}
                                                                    </FieldDescription>
                                                                    <InputGroup>
                                                                        <InputGroupTextarea
                                                                            {...field}
                                                                            id={field.name}
                                                                            aria-invalid={fieldState.invalid}
                                                                            maxLength={501}
                                                                            autoComplete="off"
                                                                            className="min-h-20 max-h-50 break-all"
                                                                        />
                                                                        <InputGroupAddon align="block-end" className="cursor-default py-2">
                                                                            <FieldLabel htmlFor={field.name} className={cn(
                                                                                "ml-auto",
                                                                                (fieldState.invalid || (field?.value?.length || 0) > 500) && 'text-destructive'
                                                                            )}>
                                                                                {(field?.value?.length || 0)}/500
                                                                            </FieldLabel>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                    <FieldError allocateLayout errors={[fieldState.error]} />
                                                                </Field>
                                                            )}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>

                            <div className='h-5' />

                            <section className='bg-secondary/50 p-6 rounded-lg border'>
                                <Controller
                                    name={'hasFoodAllergy'}
                                    control={control}
                                    shouldUnregister
                                    render={({ field, fieldState }) => (
                                        <FieldSet>
                                            <FieldLegend variant='label'>Food Allergies</FieldLegend>
                                            <FieldDescription>
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
                                                    <Field key={plan.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                        <RadioGroupItem
                                                            value={`${plan.value}`}
                                                            id={`${field.name}-${plan.id}`}
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        <FieldLabel htmlFor={`${field.name}-${plan.id}`} className='cursor-pointer'>
                                                            <FieldTitle>{plan.title}</FieldTitle>
                                                        </FieldLabel>
                                                    </Field>
                                                ))}
                                            </RadioGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldSet>
                                    )}
                                />

                                <AnimatePresence>
                                    {hasFoodAllergy && (<>
                                        <motion.div
                                            key={'food-allergy'}
                                            initial={{ opacity: 0, height: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.5 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className='overflow-hidden p-1'
                                        >
                                            <div className='h-8' />
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

                                                        <CheckboxCardGroup
                                                            name={field.name}
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            invalid={fieldState.invalid}
                                                        >
                                                            {foodAllergyList.map((item) => (
                                                                <CheckboxCard
                                                                    key={item.id}
                                                                    value={item.value}
                                                                    title={item.label}
                                                                    icon={<item.icon />}
                                                                />
                                                            ))}
                                                        </CheckboxCardGroup>

                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </FieldSet>
                                                )}
                                            />

                                            <AnimatePresence>
                                                {allergies?.includes('other') && (
                                                    <motion.div
                                                        key={'other-restriction'}
                                                        initial={{ opacity: 0, height: 0, }}
                                                        animate={{ opacity: 1, height: 'auto', }}
                                                        exit={{ opacity: 0, height: 0, }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className='overflow-hidden p-1'
                                                    >
                                                        <div className='h-8' />
                                                        <Controller
                                                            name="otherAllergies"
                                                            control={control}
                                                            shouldUnregister
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor={field.name}>Other Food Allergies</FieldLabel>
                                                                    <FieldDescription>
                                                                        Provide details for any allergies not covered in the list above.
                                                                    </FieldDescription>
                                                                    <InputGroup>
                                                                        <InputGroupTextarea
                                                                            {...field}
                                                                            id={field.name}
                                                                            aria-invalid={fieldState.invalid}
                                                                            maxLength={501}
                                                                            autoComplete="off"
                                                                            className="min-h-20 max-h-50 break-all"
                                                                        />
                                                                        <InputGroupAddon align="block-end" className="cursor-default py-2">
                                                                            <FieldLabel htmlFor={field.name} className={cn(
                                                                                "ml-auto",
                                                                                (fieldState.invalid || (field?.value?.length || 0) > 500) && 'text-destructive'
                                                                            )}>
                                                                                {(field?.value?.length || 0)}/500
                                                                            </FieldLabel>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                    <FieldError allocateLayout errors={[fieldState.error]} />
                                                                </Field>
                                                            )}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                        </motion.div>
                                    </>)}
                                </AnimatePresence>
                            </section>

                            <div className='h-5' />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={"flex w-fit items-center gap-3 ml-auto"}>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={isSubmitting}
                    >
                        <RotateCcwIcon className='text-muted-foreground' /> Reset
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting ? (
                            <Fragment>
                                <Spinner />
                                <span>Saving...</span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <UploadIcon />
                                <span>Save Submission</span>
                            </Fragment>
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default DinnerForm
