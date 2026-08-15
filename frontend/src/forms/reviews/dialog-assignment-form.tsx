import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReviewAssignmentForm from "./review-assignment-form"
import type { ReviewAssignment } from "@/domain/reviews"
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getAssignment } from '@/services/administration/review-services'

type Props = {
    assignment?: ReviewAssignment['id']
    onClose?: () => void
    setOpen?: (b: boolean) => void
    open?: boolean
}

function DialogReviewAssignmentForm({ assignment = null, open, setOpen, onClose }: Props) {

    const { data = null, isLoading } = useQuery<ReviewAssignment>({
        queryKey: ['assignment', assignment],
        queryFn: async () => {
            if (assignment === null) return null
            return await getAssignment(assignment)
        }
    })

    const onCloseFn = (v: boolean) => {
        if (open && !v) onClose?.()
        setOpen(v)
    }

    const title = data?.id ? 'Edit Review Assignment' : 'Create Review Assignment'
    const dialogdescription = data?.id ?
        'Click save when you&apos;re done.' :
        'Make changes to your profile here. Click save when you&apos;re done.'

    return (
        <Dialog open={open} onOpenChange={onCloseFn}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-xl"
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{dialogdescription}</DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="-mx-4 no-scrollbar min-h-[20vh] max-h-[60vh] px-4">

                    <ReviewAssignmentForm
                        fieldsetProps={{
                            disabled: isLoading
                        }}
                        defaultValues={{
                            id: data?.id,
                            is_active: data?.is_active,
                            abstract: data?.abstract,
                            assigned_by: data?.assigned_by,
                            due_date: new Date(data?.due_date_timestamp || new Date()),
                            user: data?.user,
                        }}
                    />
                </div>

                <div className="max-sm:text-xs text-xs text-muted-foreground">
                    <span className="font-semibold">Note:</span>{" "}
                    Each abstract submission can only be assigned to <strong>one reviewer</strong> at a time.
                    If the submission has already been assigned, you must remove the current assignment before assigning it to another reviewer.
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button form='review-assignment-form' type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogReviewAssignmentForm