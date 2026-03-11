import { authorDefaults, authorSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import AuthorForm from '../AuthorForm'
import { Button } from '@/components/ui/button'
import type z from 'zod'
import axiosClient from '@/clients/axiosClient'
import { useParams } from 'react-router'
import { isAxiosError } from 'axios'
import { Spinner } from '@/components/ui/spinner'
import { Save, SearchX } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { InfoAlert } from '@/components/InfoAlert'

type AddOrEditAuthorProps = {
    open: boolean,
    author?: AuthorSchema
    setOpen: (open: boolean) => void
    onSubmit?: () => void | Promise<void>
    onClose?: () => void
}

function AddOrEditAuthorDialog({ author, open, setOpen, onSubmit, onClose }: AddOrEditAuthorProps) {
    const alertRef = useRef<HTMLDivElement>(null)
    const { id } = useParams()
    const form = useForm<z.input<typeof authorSchema>>({
        resolver: zodResolver(authorSchema),
        defaultValues: authorDefaults,
        mode: 'all',
    })
    const { handleSubmit, reset, setError } = form
    const { isSubmitting, errors } = form.formState

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            if (data.id) {
                await axiosClient.patch(`/authors/${data.id}/`, {
                    ...data, abstract_id: id,
                })
            } else {
                await axiosClient.post('/authors/', {
                    ...data, abstract_id: id,
                })
            }
            await onSubmit?.()
            reset(authorDefaults)
            setOpen(false)
        } catch (error) {
            if (isAxiosError(error)) {
                const data = error.response.data
                if (Array.isArray(data)) {
                    setError('root', {
                        message: data.join('. '),
                        type: 'value'
                    })
                } else {
                    Object.entries(data).forEach(([field, messages]) => {
                        if (field === "non_field_errors") {
                            setError("root", { message: messages[0] })
                        } else {
                            setError(field as any, { message: messages[0] })
                        }
                    })
                }
                if (import.meta.env.DEV) {
                    console.log(error.response.data);
                }
            }
        }
    })

    const handleSelectAffiliation = (data: AuthorAffiliationSchema) => {
        form.setFocus('affiliation.institute')
        form.setValue('affiliation', { ...data }, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    const {
        data: previousAffiliations,
        fetchData: fetchAffiliations
    } = useFetch<AuthorAffiliationSchema[]>(`/abstracts/${id}/affiliations/`)

    useEffect(() => {
        if (open) { fetchAffiliations() }
    }, [open])

    useEffect(() => {
        if (author) { reset(author) }
    }, [author])

    useEffect(() => {
        if (errors.root && alertRef.current) {
            alertRef.current.focus()
            alertRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }
    }, [errors.root])

    return (
        <AlertDialog open={open} onOpenChange={value => {
            if (!value) {
                onClose?.()
                reset(authorDefaults)
            }
            setOpen(value)
        }}>
            <AlertDialogContent className="sm:max-w-2xl!">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {author ? 'Edit Author' : 'Add New Author'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {author ? 'Update the contact information and institutional affiliation for this author.' : 'Please provide the contact information and institutional affiliation for the author.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <section className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 py-2 border-y-2">
                    {errors.root && (
                        <div ref={alertRef} tabIndex={-1} aria-live="assertive" role='alert'>
                            <InfoAlert
                                variant='destructive'
                                title='Error'
                                messages={[errors.root.message]}
                            />
                        </div>
                    )}

                    <FormProvider {...form}>
                        <form onSubmit={onFormSubmit} id='authors-form'>
                            <AuthorForm />
                        </form>
                    </FormProvider>

                    {/* <Accordion type="single" collapsible defaultValue="item-1" className='space-y-5 mb-5 col-span-2 rounded-lg border shadow-md'>
                        <AccordionItem value="item-1" className='border-b last:border-b-0'>
                            <AccordionTrigger className='px-4'>Previously Used Affiliations</AccordionTrigger>
                            <AccordionContent className='space-y-5 p-4'>
                                {previousAffiliations?.map(p => (
                                    <div key={p.id}>
                                        <div onClick={() => handleSelectAffiliation(p)} className={cn(
                                            "cursor-pointer rounded-xl border-2 p-4 transition-all",
                                            "hover:border-primary hover:bg-primary/10",
                                            "border-input bg-background"
                                        )}>
                                            <div className="flex flex-col w-full gap-1">
                                                <div className='justify-self-end'>
                                                    <h3 className="font-medium leading-none">{p.institute}</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-5 w-full">
                                                    <div className='flex flex-col'>
                                                        <span className="text-sm text-muted-foreground truncate">
                                                            {p.department}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {p.city}, {p.nationality}
                                                        </span>
                                                    </div>
                                                    <div className='justify-self-end'>
                                                        <Button type='button' onClick={() => handleSelectAffiliation(p)}>
                                                            Select this
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {previousAffiliations?.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
                                        <div className="rounded-full bg-muted p-3 mb-3">
                                            <SearchX className="size-6 text-muted-foreground" />
                                        </div>
                                        <h4 className="font-medium text-muted-foreground">No previous affiliations found</h4>
                                        <p className="text-sm text-muted-foreground/60">
                                            Start by adding a new affiliation in the form.
                                        </p>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion> */}
                </section>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit' form='authors-form' disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <Save data-icon="inline-start" />
                        )}
                        Save
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AddOrEditAuthorDialog