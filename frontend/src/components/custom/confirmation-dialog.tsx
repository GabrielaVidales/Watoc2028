import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button'
import React from 'react'
import { Spinner } from '../ui/spinner'

type ConfirmationDialogProps = {
    open: boolean
    loading?: boolean
    title: React.ReactNode
    description: React.ReactNode
    btnLabel: string
    cancelBtnLabel: string
    onConfirm: () => Promise<void> | Promise<any>
    onCancel: () => void
}

function ConfirmationDialog({
    open,
    loading = false,
    title = 'Confirm action',
    description = (<span>This action <strong>cannot be undone</strong>.</span>),
    btnLabel = 'Confirm',
    cancelBtnLabel = 'Cancel',
    onConfirm = null,
    onCancel = null,
}: ConfirmationDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => { if (!next && !loading) onCancel() }}
        >
            <AlertDialogContent size='sm'>
                <AlertDialogHeader>
                    <AlertDialogTitle className="p-3 bg-destructive/10 rounded-full mb-2">
                        <TriangleAlert className='size-8 text-destructive' />
                    </AlertDialogTitle>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={null}>
                        {cancelBtnLabel}
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner className="mr-2" />
                                Deleting...
                            </>
                        ) : (
                            btnLabel
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export {
    type ConfirmationDialogProps,
    ConfirmationDialog
}