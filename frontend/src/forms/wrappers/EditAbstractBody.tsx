import React, { useEffect, useRef, useState } from 'react'
import AbstractForm from '../AbstractForm'
import { useParams } from 'react-router'
import { useFetch } from '@/hooks/use-fetch'
import { abstractSchema, submitAbstractDefaults, type AbstractSchema } from '@/schemas/abstract-schemas'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AlertTriangle, ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { EditAbstractCallbacks } from '@/pages/protected/EditAbstractPage'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { InfoAlert } from '@/components/InfoAlert'


function EditAbstractBody({ onStepBack, onStepForward }: EditAbstractCallbacks) {
    const { id } = useParams()
    const { data, fetchData } = useFetch<AbstractSchema>(`/abstracts/${id}/`)

    const form = useForm({
        resolver: zodResolver(abstractSchema),
        defaultValues: submitAbstractDefaults.parse({}),
        mode: 'onChange',
    })

    const { isValid, isSubmitting, isDirty } = form.formState

    const onFormSubmit = form.handleSubmit(async (data) => {
        await axiosClient.patch<AbstractSchema>(`/abstracts/${id}/`, data)
        await fetchData()
    })

    const [open, setOpen] = useState(false)
    const onValidate = async () => {
        const valid = await form.trigger(undefined, { shouldFocus: true })
        if (!valid) {
            setOpen(true)
            return
        }
        onStepForward?.()
    }

    return (
        <div className='w-full space-y-5 p-5'>
            <h2 className='text-2xl font-semibold'>Abstract Content</h2>

            <InfoAlert
                variant='warning'
                title='IMPORTANT'
                messages={'Total character count is 2,600 and includes spaces. Tables and images are not included, as only text is allowed. You will be able to see your character count below the text boxes.'}
                className='mx-auto'
            />

            <FormProvider {...form}>
                <form onSubmit={onFormSubmit} id='abstract-submission-form'>
                    <AbstractForm abstract={data} />
                </form>
            </FormProvider>

            <Separator />

            <fieldset disabled={isSubmitting} className='flex justify-between items-start gap-2 w-full'>
                <Button type='button' onClick={onStepBack}>
                    <ChevronLeft /> Back
                </Button>

                <div className='flex flex-col'>
                    <Button
                        type='submit'
                        form='abstract-submission-form'
                        disabled={!isValid || !isDirty}
                    >
                        {isSubmitting ? <Spinner /> : <Save />}
                        Save Changes
                    </Button>

                    {!isDirty && !isSubmitting && (
                        <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-top-1">
                            No changes were made.
                        </p>
                    )}
                </div>

                <Button type='button' onClick={onValidate}>
                    Next <ChevronRight />
                </Button>
            </fieldset>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <AlertTriangle />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                            Some information is incomplete
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-balance'>
                            Your abstract contains fields that do not meet the submission requirements.
                        </AlertDialogDescription>
                        <AlertDialogDescription className='text-balance'>

                            You may continue to the next step, but these issues must be resolved before
                            the final submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Go Back and Fix
                        </AlertDialogCancel>
                        <AlertDialogAction variant='destructive' onClick={onStepForward}>
                            Continue Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

    )
}

export default EditAbstractBody