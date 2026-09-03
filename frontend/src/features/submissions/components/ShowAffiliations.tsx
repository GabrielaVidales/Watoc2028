import React from 'react'
import AffiliationForm from '@/features/submissions/forms/AffiliationForm';
import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../../../components/ui/spinner';
import { Button } from '../../../components/ui/button';
import { Edit, Plus, School, School2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefreshCcwIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { ScrollArea } from '../../../components/ui/scroll-area';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { DEBUG } from '@/lib/constants';
import type { PaginatedResponse } from '@/domain/pagination';
import { deleteAffiliationById, getUserAffiliations } from '@/features/submissions/services/affiliation-services';
import { ConfirmProvider, useConfirm } from '@/contexts/ConfirmationDialogContext';
import type { Affiliation } from '@/features/submissions/schemas/affiliation-schema';


type Props = {
    abstractId?: number | string
    onAffiliationClicked?: (a: Affiliation) => void
}

function ShowAffiliations({ abstractId, onAffiliationClicked }: Props) {
    const { data, isLoading, isError, error, refetch } = useQuery<PaginatedResponse<Affiliation>>({
        queryKey: ['affiliations', abstractId],
        queryFn: getUserAffiliations,
    })

    const deletingMutationCount = useIsMutating({
        mutationKey: ['delete-affiliation'],
    })

    const [edit, setEdit] = React.useState<Affiliation | null>(null)
    const [openEdit, setOpenEdit] = React.useState<boolean>(false)

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

            <Button size='sm' disabled={deletingMutationCount > 0} onClick={() => { setEdit(null); setOpenEdit(true) }}>
                <Plus />
                Add affiliation
            </Button>

            <div className='space-y-2'>
                <ConfirmProvider>
                    {affiliations?.length > 0 && affiliations.map((item) => (
                        <AffiliationItemComponent
                            key={item.id}
                            disabled={deletingMutationCount > 0}
                            affiliation={item}
                            onEditAffiliation={(a) => {
                                setEdit(a);
                                setOpenEdit(true);
                                onAffiliationClicked?.(a)
                            }}
                        />
                    ))}
                </ConfirmProvider>
            </div>
        </div>
    )
}

export default ShowAffiliations


type AffiliationItemComponentProps = {
    disabled: boolean
    affiliation: Affiliation
    onEditAffiliation: (a: Affiliation) => void
}

function AffiliationItemComponent({
    disabled,
    affiliation,
    onEditAffiliation
}: AffiliationItemComponentProps) {
    const queryClient = useQueryClient()

    const confirm = useConfirm()

    const deleteMutation = useMutation<void, AxiosError<any>, number | string>({
        mutationKey: ['delete-affiliation'],
        mutationFn: deleteAffiliationById,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['affiliations'], exact: false }),
                queryClient.invalidateQueries({ queryKey: ['authors'], exact: false }),
            ])
        },
        onError: (error) => {
            toast.error(error.response.data.errors.root)
            DEBUG && console.error(error.response.data.errors.root);
        }
    })

    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete Affiliation",
            description: (
                <span>This action <strong>cannot be undone</strong>.
                    This will permanently remove this affiliation.</span>
            )
        })
        ok && deleteMutation.mutate(affiliation.id)
    }

    return (
        <div
            className={cn(
                'relative p-2 border-2 border-border rounded-md transition-colors! duration-300',
                'bg-background flex flex-col gap-3 pl-3 md:flex-row md:items-center md:justify-between',
            )}
        >
            <Avatar className="size-10 shrink-0 border shadow-sm">
                <AvatarFallback>
                    <School2 />
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-0">
                <h4 className="font-medium text-sm truncate" title={affiliation.institution}>
                    {affiliation.institution}
                </h4>
                <p className="truncate text-xs text-muted-foreground">
                    {affiliation.city}, {affiliation.country}
                </p>
            </div>
            <fieldset className='ml-auto' disabled={disabled || deleteMutation.isPending}>
                <Button variant='ghost' size='icon-sm' onClick={() => { onEditAffiliation?.(affiliation) }}>
                    <Edit className='text-primary-main size-5' />
                </Button>

                <Button variant='ghost' size='icon-sm' onClick={handleDelete}>
                    <Trash2 className='text-destructive size-5' />
                </Button>
            </fieldset>
        </div>
    )
}