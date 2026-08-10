import api from '@/clients/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Spinner } from './ui/spinner';
import type { Affiliation } from '@/schemas/abstracts/affiliation-schema';
import { Button } from './ui/button';
import { Edit, Plus, School, School2, Trash2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefreshCcwIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { CardAction, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { ScrollArea } from './ui/scroll-area';
import AffiliationForm from '@/forms/AffiliationForm';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { PaginatedResponse } from '@/domain/pagination';
import { useParams } from 'react-router';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DEBUG } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';


type Props = {
    onAffiliationClicked?: (a: Affiliation) => void
    abstractId?: number | string
}

function ShowAffiliations({ abstractId, onAffiliationClicked }: Props) {
    const queryClient = useQueryClient()

    const { data, isLoading, isError, isFetching, error, refetch } = useQuery<PaginatedResponse<Affiliation>>({
        queryKey: ['affiliations', abstractId],
        queryFn: async () => {
            const { data } = await api.get('/abstracts/affiliations');
            return data
        },
    })

    const [edit, setEdit] = React.useState<Affiliation | null>(null)
    const [openEdit, setOpenEdit] = React.useState<boolean>(false)

    const [open, setOpen] = useState(false)
    const [deleteAffiliation, setDeleteAffiliation] = useState<Affiliation>(null)
    const deleteMutation = useMutation({
        mutationFn: async (id: number | string) => {
            const { data } = await api.delete(`/abstracts/affiliations/${id}/`);
            return data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['affiliations'] }),
                queryClient.invalidateQueries({ queryKey: ['authors', abstractId], }),
            ])
            setDeleteAffiliation(null)
            setOpen(false)
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                toast.error(error.response.data.errors.root)
                if (DEBUG) {
                    console.error(error.response.data.errors.root);
                }
            }
        }
    })

    if (!abstractId) {
        return <Spinner />
    }

    if (isLoading) return (
        <div className='mx-auto w-full text-muted-foreground'>
            <Spinner className='size-10 mx-auto' />
            <p className='text-center'>Loading...</p>
        </div>
    )

    if (isError) return (
        <p>Failed to load affiliations: {error.message}</p>
    )

    const affiliations = data?.results ?? []

    if (affiliations?.length === 0) return (
        <Empty className="mx-auto h-full select-none">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <School2 className='text-muted-foreground' />
                </EmptyMedia>
                <EmptyTitle className='text-muted-foreground'>No affiliations yet</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    Create your first affiliation using the <strong>Add Affiliation</strong> button above.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCcwIcon />
                    Refresh
                </Button>
            </EmptyContent>
        </Empty>
    )

    return (
        <div className='space-y-4'>
            <AlertDialog open={open} onOpenChange={(v) => { setDeleteAffiliation(null); setOpen(v) }}>
                <AlertDialogContent size='sm'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="p-3 bg-destructive/10 rounded-full mb-2">
                            <TriangleAlert className='size-8 text-destructive' />
                        </AlertDialogTitle>
                        <AlertDialogTitle>Delete Affiliation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action <strong>cannot be undone</strong>. This will permanently remove this affiliation.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant='destructive' onClick={() => deleteMutation.mutate(deleteAffiliation.id)} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? (<>
                                <Spinner className="mr-2" />
                                Deleting...
                            </>) : 'Delete Author'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openEdit} onOpenChange={() => { setOpenEdit(false); setEdit(null); }}>
                <DialogContent className='max-w-md w-full'>
                    <DialogHeader>
                        <DialogTitle>{edit !== null ? 'Edit Affiliation' : 'New Affiliation'}</DialogTitle>
                        <DialogDescription className='max-sm:text-xs'>
                            {edit !== null
                                ? 'Update the necessary fields below and save your changes.'
                                : 'Fill out the form below to add a new affiliation to the list.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="-mx-4 max-h-[60vh] overflow-y-auto px-4 overflow-visible">
                        <AffiliationForm
                            id='affiliation-form'
                            abstractId={abstractId}
                            defaults={edit}
                            onSubmitSuccess={() => { setOpenEdit(false); setEdit(null); }}
                        />
                    </ScrollArea>
                    <DialogDescription className='max-sm:text-[10px] text-xs pt-2'>
                        Note: The affiliations created here can be assigned to authors when adding them to an abstract submission.
                        Make sure each author is linked to the correct affiliation before submitting.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form='affiliation-form'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CardHeader className='px-0'>
                <CardTitle className="flex gap-3 items-center">
                    <School className='text-primary-main shrink-0' />
                    <h2 className='text-xl font-semibold'>Manage Affiliations</h2>
                </CardTitle>
                <CardDescription>
                    View, create, edit, or remove affiliation records for your organization.
                </CardDescription>
            </CardHeader>

            <Button size='sm' onClick={() => { setEdit(null); setOpenEdit(true) }}>
                <Plus />
                Add affiliation
            </Button>

            <div className='space-y-2'>
                {affiliations?.length > 0 && affiliations.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            'relative p-2 border-2 border-border rounded-md transition-colors! duration-300',
                            'bg-background active:border-primary-light active:shadow-md',
                            'md:flex-row md:items-center md:justify-between',
                            'flex flex-col gap-3 pl-3',
                        )}
                    >
                        <Avatar className="size-10 shrink-0 border shadow-sm">
                            <AvatarFallback>
                                <School2 />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium text-sm">{item.institution}</h4>
                            <p className="text-muted-foreground text-sm">
                                {item.city}, {item.country}
                            </p>
                        </div>
                        <fieldset className='ml-auto' disabled={isFetching || deleteMutation.isPending}>
                            <Button variant='ghost' size='icon-sm' onClick={() => { setEdit(item); setOpenEdit(true); onAffiliationClicked?.(item) }}>
                                <Edit className='text-primary-main size-5' />
                            </Button>

                            <Button variant='ghost' size='icon-sm' onClick={() => { setDeleteAffiliation(item); setOpen(true) }}>
                                <Trash2 className='text-destructive size-5' />
                            </Button>
                        </fieldset>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ShowAffiliations