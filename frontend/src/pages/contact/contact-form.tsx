import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { contactSchemaForm, contactSubject, type ContactFormValues } from './contact-form-schema'
import { Field, FieldContent, FieldError, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { countries } from '@/utils/countriesInfo'
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import axiosClient from '@/clients/axiosClient'
import { isAxiosError } from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { InfoAlert } from '@/components/InfoAlert'
import { Spinner } from '@/components/ui/spinner'
import { toSnakeCase } from '@/lib/utils'


function ContactForm() {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchemaForm),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            acceptTerms: false,
            salutation: '',
            academicTitle: '',
            institution: '',
            city: '',
            country: '',
            countyStateRegion: '',
            zip: '',
        },
        mode: 'onTouched',
    })

    const { handleSubmit, formState: { errors, isDirty, isSubmitting, isSubmitSuccessful } } = form

    const onFormSubmit = handleSubmit(async (validData) => {
        if (isSubmitting || isSubmitSuccessful) return
        try {
            const response = await axiosClient.post('/contact/', toSnakeCase(validData))
            if (import.meta.env.DEV) {
                console.log(response);
            }

        } catch (error) {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.log(error.response)
                }
                if (error.response.data.message) {
                    form.setError('root', {
                        type: 'root',
                        message: error.response.data.message,
                    })
                } else {
                    form.setError('root', {
                        type: 'root',
                        message: 'Something went wrong. Try again later.',
                    })
                }
            }
        }
    })

    return (
        <form onSubmit={onFormSubmit}>
            <AnimatePresence>
                {errors.root ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-4"
                    >
                        <InfoAlert
                            variant='destructive'
                            messages={[
                                <span className='text-red-950'>
                                    {errors.root.message}
                                </span>
                            ]}
                            title='Server responded with an error:'
                        />
                    </motion.div>
                ) : isSubmitSuccessful && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-4"
                    >
                        <InfoAlert
                            variant='success'
                            messages={[
                                <span className='text-green-950'>
                                    Your message was successfully received. Our team will get back to you shortly.
                                </span>
                            ]}
                            title='Message Sent!'
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <fieldset className='grid grid-cols-1 sm:grid-cols-2 gap-y-9 gap-x-5' disabled={isSubmitting || isSubmitSuccessful}>
                <Separator className='col-span-full' />

                <Controller
                    name="salutation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Salutation</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder='Salutation e.g. Ms, Mr, Mrs'
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="academicTitle"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Academic Title</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='relative'>
                            <FieldLabel htmlFor={field.name}>First Name <span className='text-destructive'>*</span></FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <div className="absolute -bottom-7 left-0">
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='relative'>
                            <FieldLabel htmlFor={field.name}>Last Name <span className='text-destructive'>*</span></FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <div className="absolute -bottom-7 left-0">
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='relative h-fit'>
                            <FieldLabel htmlFor={field.name}>Email Address <span className='text-destructive'>*</span></FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder='example@email.com'
                            />
                            {fieldState.invalid && (
                                <div className="absolute -bottom-7 left-0">
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="institution"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Institution</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <div className='hidden'>
                    <Separator className='col-span-full' />
                    <Controller
                        name="city"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="countyStateRegion"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>County / State / Region</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="country"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Country
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue placeholder="Country..." />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {countries.map(c => (
                                            <SelectItem value={c.value as string} key={c.value}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    srcSet={`https://flagcdn.com/w40/${c.value.toString().toLowerCase()}.png 2x`}
                                                    src={`https://flagcdn.com/w20/${c.value.toString().toLowerCase()}.png`}
                                                    alt=""
                                                />
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="zip"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>ZIP / Postal Code</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>


                <Controller
                    name="subject"
                    defaultValue=''
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid} className='relative col-span-full'>
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
                                    {contactSubject.map(item => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <div className="absolute -bottom-7 left-0">
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="message"
                    control={form.control}
                    defaultValue=''
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='relative mb-2 col-span-full'>
                            <FieldLabel htmlFor={field.name}>Message <span className='text-destructive'>*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id={field.name}
                                    className="resize-none min-h-30 max-h-60"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <FieldLabel htmlFor={field.name} className="tabular-nums ml-auto">
                                        {field.value.length}/2048 characters
                                    </FieldLabel>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <div className="absolute -bottom-7 left-0">
                                    <FieldError errors={[fieldState.error]} />
                                </div>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="acceptTerms"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            key={field.name}
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                            className='col-span-full'
                        >
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                onCheckedChange={field.onChange}
                            />
                            <FieldContent>
                                <FieldLabel htmlFor={field.name} className='inline cursor-pointer'>
                                    I have read the privacy policy note. I agree that my information and data relate to the question. <span className='text-destructive'>*</span>
                                </FieldLabel>
                            </FieldContent>
                        </Field>
                    )}
                />

                <div className='col-span-full flex justify-end w-fit ml-auto'>
                    <Button
                        type='submit'
                        disabled={!isDirty}
                        variant='main'
                        className='w-full text-lg'
                        size='lg'
                    >
                        Send
                        {isSubmitting ? (
                            <Spinner className='size-6' />
                        ) : (
                            <ChevronRight className='size-6' />
                        )}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}

export default ContactForm
