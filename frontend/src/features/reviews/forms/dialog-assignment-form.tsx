import React, { useMemo } from 'react'
import ReviewAssignmentForm from "./review-assignment-form"
import type { ReviewAssignment } from "@/features/reviews/types/reviews"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import { createAssignment, getAssignment, mapAssignmentErrors, notifyAssignmentCreated, notifyAssignmentUpdated, updateAssignment } from '@/services/administration/review-assignments-services'
import { assignmentSchema, type AssignmentFormInput, type AssignmentFormOutput } from '@/features/reviews/schemas/review-assignment-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RotateCw, Trash2 } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { AxiosError } from 'axios'
import { DEBUG } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'

type Props = {
    assignment?: ReviewAssignment['id']
    onClose?: () => void
    setOpen?: (b: boolean) => void
    open?: boolean
}

export default function DialogReviewAssignmentForm({ assignment = null, open, setOpen, onClose }: Props) {
    const queryClient = useQueryClient()

    const { user } = useAuth()

    const onCloseFn = (v: boolean) => {
        if (open && !v) onClose?.()
        setOpen(v)
        form.reset({})
    }

    // TanStack query
    const { data = null, isLoading } = useQuery<ReviewAssignment>({
        refetchOnWindowFocus: false,
        queryKey: ['assignment', assignment],
        queryFn: async () => {
            if (assignment === null) return null
            return await getAssignment(assignment)
        }
    })

    const create = useMutation<ReviewAssignment, AxiosError<any, any>, AssignmentFormOutput>({
        mutationFn: createAssignment,
        onSuccess: async (assignment) => {
            notifyAssignmentCreated(assignment)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['reviewers'], }),
                queryClient.invalidateQueries({ queryKey: ['assignment'], })
            ])

            onCloseFn(false)
        },
        onError: (e) => mapAssignmentErrors(e, form),
    })

    const edit = useMutation<ReviewAssignment, AxiosError<any, any>, AssignmentFormOutput>({
        mutationFn: updateAssignment,
        onSuccess: async (assignment) => {
            notifyAssignmentUpdated(assignment)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['reviewers'], }),
                queryClient.invalidateQueries({ queryKey: ['assignment'], })
            ])

            onCloseFn(false)
        },
        onError: (e) => mapAssignmentErrors(e, form),
    })

    // Form handling
    const defaultValues = useMemo(() => ({
        id: data?.id,
        assigned_by: user,
        is_active: data?.is_active,
        abstract: data?.abstract,
        due_date: new Date(data?.due_date_timestamp || new Date()),
        user: data?.user,
    }), [user, data])

    const form = useForm<AssignmentFormInput, any, AssignmentFormOutput>({
        resolver: zodResolver(assignmentSchema),
        mode: 'onChange',
        defaultValues: {
            id: null,
            user: null,
            abstract: null,
            assigned_by: user,
            due_date: null,
            is_active: true,
        }
    })

    const onFormSubmit = form.handleSubmit((data) => {
        if (data.id) {
            edit.mutate(data)
            return
        }
        create.mutate(data)
    }, (data) => {
        DEBUG && console.log(data)
    })

    const disabled = isLoading || create.isPending || edit.isPending
    const title = data?.id ? 'Edit Review Assignment' : 'Create Review Assignment'
    const dialogdescription = data?.id ?
        "Click save when you're done." : "Make changes to your profile here. Click save when you're done."

    return (
        <Dialog open={open} onOpenChange={onCloseFn}>
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{dialogdescription}</DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="-mx-4 no-scrollbar min-h-[20vh] max-h-[60vh] px-4">
                    <FormProvider {...form}>
                        <form onSubmit={onFormSubmit} id='review-assignment-form'>
                            <ReviewAssignmentForm
                                disabled={disabled}
                                defaultValues={defaultValues}
                            />
                        </form>
                    </FormProvider>
                </div>

                <div className="max-sm:text-xs text-xs text-muted-foreground">
                    <span className="font-semibold">Note:</span>{" "}
                    Each abstract submission can only be assigned to <strong>one reviewer</strong> at a time.
                    If the submission has already been assigned, you must remove the current assignment before assigning it to another reviewer.
                </div>

                <Separator />

                <DialogFooter>
                    {data?.id ? (
                        <Button type='button' variant='destructive' className='mr-auto' disabled={disabled}>
                            <Trash2 />
                            Delete
                        </Button>
                    ) : (
                        <Button type='button' variant='outline' className='mr-auto' onClick={() => form.reset()} disabled={disabled}>
                            <RotateCw />
                            Clear
                        </Button>
                    )}

                    <DialogClose asChild>
                        <Button variant="outline" disabled={disabled}>Cancel</Button>
                    </DialogClose>
                    <Button form='review-assignment-form' type="submit" disabled={disabled}>
                        {disabled && <Spinner />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}