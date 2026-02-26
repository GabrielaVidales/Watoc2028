import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { abstractSchema, presentationTypes, submitAbstractDefaults, submitAbstractSchema, type AbstractSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {  GripVertical, Save, Send, Trash2, UserPlus } from 'lucide-react'
import { AnimatePresence, Reorder } from 'motion/react'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { InfoAlert } from '@/pages/protected/CreateAbstractPage'

type Props = {
    abstract?: AbstractSchema
}

function AbstractForm({ abstract }: Props) {
    const { handleSubmit, reset, control, formState: { isValid, isSubmitting, errors } } = useForm({
        resolver: zodResolver(submitAbstractSchema),
        defaultValues: submitAbstractDefaults.parse(abstract || {}),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    })

    const onSubmit = handleSubmit(async (data) => {
        await new Promise(r => setTimeout(r, 1000))

        const payload = {
            ...data,
            authors: data.authors.map((a, i) => ({ ...a, order: i, })),
        }

        const puta = abstractSchema.parse(data)
        console.log(puta);

    }, invalid => {
        console.log(invalid);
    })


    const { remove, fields, swap, append } = useFieldArray({
        control: control,
        name: 'authors',
    })

    const handleAddAuthor = () => append({ firstName: '', lastName: '', is_corresponding: false });
    const handleRemoveAuthor = (index: number) => remove(index);
    const handleReorderAuthors = (newFields: { id: string; }[]) => {
        const firstDiffIndex = fields.findIndex(
            (field, index) => field.id !== newFields[index].id,
        );
        if (firstDiffIndex !== -1) {
            const newIndex = newFields.findIndex(
                (field: { id: string; }) => field.id === fields[firstDiffIndex].id,
            );
            swap(firstDiffIndex, newIndex);
        }
    }

    const onDebugData = () => {
        reset(DEBUG_DATA)
    }
    const DEBUG_DATA = {
        id: null,
        title: "Impact of Neural Network Architectures on Real-Time Data Processing",
        presentationType: "oral",
        text: "This study investigates the efficiency of various neural network architectures in the context of real-time data streaming. By comparing convolutional and recurrent models, we demonstrate that optimized lightweight layers can reduce latency by 40% without compromising predictive accuracy. Our findings provide a framework for deploying complex AI models on edge computing devices with limited hardware resources, ensuring high-speed performance for critical applications in autonomous systems and smart infrastructure. This study investigates the efficiency of various neural network architectures in the context of real-time data streaming. By comparing convolutional and recurrent models, we demonstrate that optimized lightweight layers can reduce latency by 40% without compromising predictive accuracy. Our findings provide a framework for deploying complex AI models on edge computing devices with limited hardware resources, ensuring high-speed performance for critical applications in autonomous systems and smart infrastructure. This study investigates the efficiency of various neural network architectures in the context of real-time data streaming. By comparing convolutional and recurrent models, we demonstrate that optimized lightweight layers can reduce latency by 40% without compromising predictive accuracy. Our findings provide a framework for deploying complex AI models on edge computing devices with limited hardware resources, ensuring high-speed performance for critical applications in autonomous systems and smart infrastructure.",
        authors: [
            {
                firstName: "John",
                lastName: "Doe",
                email: "j.doe@research-inst.org",
                order: 1,
                is_corresponding: true
            }
        ],
        references: "Smith, A. (2024). Advanced Neural Systems; Johnson, L. (2023). Edge Computing Efficiency."
    };

    return (
        <form onSubmit={onSubmit}>
            <fieldset disabled={isSubmitting}>
                <div className='space-y-7'>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Your awesome title..."
                                    maxLength={128}
                                    autoComplete="off"
                                    variant='inline'
                                    className='pb-1 h-10 text-xl! font-semibold placeholder:font-normal '
                                />
                                <FieldDescription>The abstract title must have a maximum of 10 words.</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="presentation_type"
                        defaultValue='oral'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="presentationType">Presentation Format</FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="presentationType"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-30 border-2"
                                    >
                                        <SelectValue placeholder="Choose an option..." />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {presentationTypes.map(item => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                                <FieldDescription>Select the preferred format for presenting your work.</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="text"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Abstract text</FieldLabel>
                                <FieldDescription>Enter the abstract content below.</FieldDescription>
                                <InfoAlert
                                    title='IMPORTANT'
                                    messages={'Total character count is 2,600 and includes spaces. Tables and images are not included, as only text is allowed. You will be able to see your character count below the text boxes.'}
                                    className='mx-auto'
                                />
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    placeholder="Provide a concise summary of your work (max. 500 words)..."
                                    className="min-h-40 max-h-90"
                                    maxLength={3500}
                                />
                                <FieldDescription className='flex justify-end'>
                                    <WordCounter control={control} limit={500} name={field.name} />
                                </FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />


                    <Controller
                        name="references"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>References</FieldLabel>
                                <FieldDescription>Enter the numbered references below in Vancouver format.</FieldDescription>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    className="min-h-25 max-h-50"
                                    placeholder="Enter your numbered references here (max. 150 words)..."
                                    maxLength={1500}
                                />
                                <FieldDescription className='flex justify-end'>
                                    <WordCounter control={control} limit={150} name={field.name} />
                                </FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <section className=' mx-auto bg-white'>
                        <Field className='mb-3 flex flex-row justify-between'>
                            <FieldSet className='gap-1'>
                                <FieldLabel>Author List</FieldLabel>
                                <FieldDescription>List authors in the order they appear in the paper.</FieldDescription>
                            </FieldSet>
                            <FieldContent>
                                <Button type='button' onClick={handleAddAuthor}>
                                    <UserPlus data-icon='inline-start' /> Add Author
                                </Button>
                            </FieldContent>
                        </Field>

                        <InfoAlert
                            title='IMPORTANT'
                            messages={[
                                'You must add at least 1 author and no more than 10',
                                'You must have 1 presenting author for this abstract',
                                'You must have 1 fisrt author for this abstract'
                            ]}
                        />

                        <div className='overflow-y-scroll py-2 flex flex-col justify-start'>
                            <Reorder.Group values={fields} axis='y' onReorder={handleReorderAuthors} >
                                <AnimatePresence mode="sync">
                                    {fields.map((field, index) => (
                                        <Reorder.Item key={field.id} value={field}
                                            initial={{ opacity: 0, height: 0, }}
                                            animate={{ opacity: 1, height: 'auto', }}
                                            transition={{ type: "tween", duration: 0.2, ease: 'easeInOut' }}
                                            exit={{ opacity: 0, }}
                                            layout
                                        >
                                            <div className='flex gap-3 w-full mb-2 border-2 bg-background rounded-md p-2 shadow-md'>
                                                <GripVertical className='cursor-grab text-foreground' />
                                                <div className='grid grid-cols-3 w-full gap-4 py-2'>
                                                    <div className='col-span-2 grid grid-cols-4 gap-3'>
                                                        <Controller
                                                            name={`authors.${index}.firstName`}
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                                                                    <Input {...field}
                                                                        id={field.name}
                                                                        aria-invalid={fieldState.invalid}
                                                                        placeholder="First name"
                                                                        maxLength={128}
                                                                        autoComplete="off"
                                                                    />
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`authors.${index}.lastName`}
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                                                                    <Input
                                                                        {...field}
                                                                        id={field.name}
                                                                        aria-invalid={fieldState.invalid}
                                                                        placeholder="Last name"
                                                                        maxLength={128}
                                                                        autoComplete="off"
                                                                    />
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`authors.${index}.email`}
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid} className='col-span-2' >
                                                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                                    <Input
                                                                        {...field}
                                                                        id={field.name}
                                                                        aria-invalid={fieldState.invalid}
                                                                        placeholder="author@mail.com"
                                                                        maxLength={128}
                                                                        autoComplete="off"
                                                                    // variant='inline'
                                                                    />
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                                </Field>
                                                            )}
                                                        />
                                                    </div>
                                                    <Controller
                                                        name={`authors.${index}.is_corresponding`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <FieldSet className='gap-2'>
                                                                <FieldLegend variant='label' className='mb-1'>Role</FieldLegend>
                                                                <FieldDescription>Select at least one role</FieldDescription>
                                                                <FieldContent>
                                                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                                        <Checkbox
                                                                            id={field.name}
                                                                            name={field.name}
                                                                            aria-invalid={fieldState.invalid}
                                                                            checked={field.value}
                                                                            onCheckedChange={(checked) => { field.onChange(checked) }}
                                                                        />
                                                                        <FieldLabel htmlFor={field.name} className="font-normal inline cursor-pointer">
                                                                            First author
                                                                        </FieldLabel>
                                                                    </Field>
                                                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                                        <Checkbox
                                                                            id={field.name}
                                                                            name={field.name}
                                                                            aria-invalid={fieldState.invalid}
                                                                            checked={field.value}
                                                                            onCheckedChange={(checked) => { field.onChange(checked) }}
                                                                        />
                                                                        <FieldLabel htmlFor={field.name} className="font-normal inline cursor-pointer">
                                                                            Co-author
                                                                        </FieldLabel>
                                                                    </Field>
                                                                </FieldContent>
                                                            </FieldSet>
                                                        )}
                                                    />
                                                </div>
                                                <Trash2 onClick={() => handleRemoveAuthor(index)} className="size-8 p-1 cursor-pointer text-red-500 hover:text-white hover:bg-red-500  disabled:text-red-300 disabled:bg-transparent rounded-lg transition-all duration-200 flex items-center justify-center group" />
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </AnimatePresence>
                            </Reorder.Group>
                        </div>

                        {errors.authors?.root && <FieldError errors={[errors.authors.root]} />}

                        <Controller
                            name="authorsConsent"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet className='gap-3'>
                                    <Field
                                        key={field.name}
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                        className='p-5 border-2 rounded-lg'
                                    >
                                        <Checkbox
                                            id={field.name}
                                            name={field.name}
                                            aria-invalid={fieldState.invalid}
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked)
                                            }}
                                        />
                                        <FieldLabel htmlFor={field.name} className="font-normal inline cursor-pointer">
                                            I declare that all <b>co-authors</b> have granted consent to submit this abstract.
                                        </FieldLabel>
                                    </Field>

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldSet>
                            )}
                        />
                    </section>

                    <div className='flex flex-col items-start gap-3 w-full'>
                        <Button type='submit' className='p-5 w-60 uppercase' disabled={!isValid}>
                            {isSubmitting ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <Save data-icon="inline-start" />
                            )}
                            Save abstract
                        </Button>
                        <Button onClick={onDebugData}>
                            Debug Data
                        </Button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}

export default AbstractForm


const WordCounter = ({ control, name, limit }: { control: any, name: string, limit: number }) => {
    const text = useWatch({
        control: control,
        name: name,
        defaultValue: '',
    })

    return (
        <span className='text-xs text-muted-foreground'>
            {text?.split(/\s+/).filter(Boolean).length} / {limit}
        </span>
    )
}
