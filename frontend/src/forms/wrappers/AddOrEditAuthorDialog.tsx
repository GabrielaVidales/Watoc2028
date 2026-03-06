import { authorDefaults, authorSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
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

type AddOrEditAuthorProps = {
    open: boolean,
    author?: AuthorSchema
    setOpen: (open: boolean) => void
    onSubmit?: () => void | Promise<void>
}

function AddOrEditAuthorDialog({ open, setOpen, onSubmit, author }: AddOrEditAuthorProps) {
    const { id } = useParams()
    const form = useForm<z.input<typeof authorSchema>>({
        resolver: zodResolver(authorSchema),
        defaultValues: authorDefaults,
        mode: 'onSubmit',
    })
    const { handleSubmit, reset } = form
    const { isValid, isSubmitting } = form.formState

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
            setOpen(false)
            reset({})
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
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

    return (
        <AlertDialog open={open} onOpenChange={value => {
            reset({})
            setOpen(value)
        }}>
            <AlertDialogContent className="sm:max-w-2xl!">
                <AlertDialogHeader>
                    <AlertDialogTitle>Add New Author</AlertDialogTitle>
                    <AlertDialogDescription>
                        Escribe los datos de contacto y de afiliación del autor.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <section className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 border-y-2">
                    <FormProvider {...form}>
                        <form onSubmit={onFormSubmit} id='authors-form'>
                            <AuthorForm />
                        </form>
                    </FormProvider>

                    <Accordion type="single" collapsible defaultValue="item-1" className='space-y-5 col-span-2 rounded-lg border shadow-md'>
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
                    </Accordion>
                </section>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit' form='authors-form' disabled={!isValid}>
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