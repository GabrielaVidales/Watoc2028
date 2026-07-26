import api from '@/clients/api'
import { InfoAlert } from '@/components/InfoAlert'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFetch } from '@/hooks/use-fetch'
import { authorDefaults, authorSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstracts/abstract-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Save } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import type z from 'zod'
import AuthorForm from '../AuthorForm'

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
                await api.patch(`/authors/${data.id}/`, {
                    ...data, abstract_id: id,
                })
            } else {
                await api.post('/authors/', {
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
    } = useFetch<AuthorAffiliationSchema[]>(`/abstracts/submissions/${id}/affiliations/`)

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