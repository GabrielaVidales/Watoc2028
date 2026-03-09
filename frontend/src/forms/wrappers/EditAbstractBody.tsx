import React, { useEffect, useRef } from 'react'
import AbstractForm from '../AbstractForm'
import { useParams } from 'react-router'
import { useFetch } from '@/hooks/use-fetch'
import { abstractSchema, submitAbstractDefaults, type AbstractSchema } from '@/schemas/abstract-schemas'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { EditAbstractCallbacks } from '@/pages/protected/EditAbstractPage'

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
        const res = await axiosClient.patch<AbstractSchema>(`/abstracts/${id}/`, data)
        await fetchData()
        console.log(res);

    }, invalid => {
        console.log(invalid);
    })

    return (
        <div className='w-full space-y-5 p-5'>
            <h2 className='text-2xl font-semibold'>Abstract Body</h2>
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

                <Button type='button' onClick={onStepForward}>
                    Next <ChevronRight />
                </Button>
            </fieldset>

        </div>

    )
}

export default EditAbstractBody