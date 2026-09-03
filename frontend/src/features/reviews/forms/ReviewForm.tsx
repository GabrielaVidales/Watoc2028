import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reviewSchema, type ReviewSchema } from '@/features/reviews/schemas/review-schema'
import { cn, countWords } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type Props = {
    defaultValue?: ReviewSchema
}

function ReviewForm({ defaultValue }: Props) {

    const { control, reset, handleSubmit } = useForm<ReviewSchema>({
        resolver: zodResolver(reviewSchema),
        mode: 'onChange',
        defaultValues: {
            status: '',
            suggestions: '',
            comments: '',
        }
    })

    useEffect(() => {
        if (defaultValue) {
            reset({
                comments: defaultValue.comments,
                suggestions: defaultValue.suggestions,
                status: defaultValue.status,
            })
        }
    }, [defaultValue])

    const onFormSubmit = handleSubmit(async (data: ReviewSchema) => {
        console.log(data);
    })

    return (
        <form onSubmit={onFormSubmit} id='review-form'>
            <fieldset className='space-y-3'>
                <Controller
                    name="status"
                    defaultValue='oral'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                            <FieldDescription>Aquí elige el nuevo status del cosa.</FieldDescription>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="presentationType"
                                    aria-invalid={fieldState.invalid}
                                    className="border-2"
                                >
                                    <SelectValue placeholder="Choose an option..." />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {[
                                        {
                                            value: 'accepted',
                                            label: 'Accepted',
                                        },
                                        {
                                            value: 'declined',
                                            label: 'Declined',
                                        },
                                    ].map(item => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={'comments'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                            <FieldDescription>Explain why you did this.</FieldDescription>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    maxLength={1500}
                                    placeholder="Write a comment..."
                                />
                                <InputGroupAddon align="block-end" className='py-1'>
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            (fieldState.invalid || countWords(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWords(field.value || "")}/1000 words left
                                        </FieldLabel>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={'suggestions'}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                            <FieldDescription>Explain why you did this.</FieldDescription>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    maxLength={1500}
                                    placeholder="Write a comment..."
                                />
                                <InputGroupAddon align="block-end" className=' py-1'>
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            (fieldState.invalid || countWords(field.value || "") > 350) && 'text-destructive'
                                        )}>
                                            {countWords(field.value || "")}/1000 words left
                                        </FieldLabel>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <div className={cn(
                                "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                fieldState.invalid ? " opacity-100" : " opacity-0"
                            )}>
                                <FieldError errors={[fieldState.error]} />
                            </div>
                        </Field>
                    )}
                />




            </fieldset>
        </form>
    )
}

export default ReviewForm