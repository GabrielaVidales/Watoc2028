import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button'
import React from 'react'
import { Spinner } from '../ui/spinner'

type ConfirmationDialogProps = {
    open: boolean
    setOpen: (b: boolean) => void
    btnLabel: string
    cancelBtnLabel: string
    title: string
    description: string
    onConfirmCallback: () => Promise<void> | Promise<any>
    onCancelCallback: () => void
}

function ConfirmationDialog({
    open,
    setOpen,
    title,
    description,
    btnLabel,
    cancelBtnLabel,
    onConfirmCallback = null,
    onCancelCallback = null,

}: ConfirmationDialogProps) {
    const [loading, setLoading] = React.useState(false)

    const onConfirm = async () => {
        setLoading(true)
        await onConfirmCallback?.()
        setLoading(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent size='sm'>
                <AlertDialogHeader>
                    <AlertDialogTitle className="p-3 bg-destructive/10 rounded-full mb-2">
                        <TriangleAlert className='size-8 text-destructive' />
                    </AlertDialogTitle>
                    <AlertDialogTitle>
                        {title || 'Confirm action'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description || (
                            <span>This action <strong>cannot be undone</strong>. This will permanently remove this affiliation.</span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancelCallback}>
                        {cancelBtnLabel || 'Cancel'}
                    </AlertDialogCancel>
                    <Button variant='destructive' onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner className="mr-2" />
                                Deleting...
                            </>
                        ) : (
                            btnLabel || 'Confirm'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationDialog