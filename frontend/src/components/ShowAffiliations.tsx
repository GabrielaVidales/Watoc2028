import axiosClient from '@/clients/axiosClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Spinner } from './ui/spinner';
import type { Affiliation } from '@/schemas/affiliation-schema';
import { Button } from './ui/button';
import { Edit, School2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefreshCcwIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"


type Props = {
    onAffiliationClicked?: (a: Affiliation) => void
}

function ShowAffiliations({ onAffiliationClicked }: Props) {

    const { data: affiliations, isLoading, isError, isFetching, error, refetch } = useQuery<Affiliation[]>({
        queryKey: ['affiliations'],
        queryFn: async () => {
            const { data } = await axiosClient.get('/abstracts/affiliations');
            return data
        },
    })

    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async (id: number | string) => {
            const { data } = await axiosClient.delete(`/abstracts/affiliations/${id}/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['affiliations'] });
        },
    })

    if (isLoading) return (
        <div className='mx-auto w-full text-muted-foreground'>
            <Spinner className='size-10 mx-auto' />
            <p className='text-center'>Loading...</p>
        </div>
    )

    if (isError) return <p>Failed to load affiliations: {error.message}</p>;

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
        <div className='space-y-3'>
            {affiliations?.length > 0 && affiliations.map((item, i) => (
                <div
                    key={i}
                    className={cn(
                        'cursor-pointer p-3 border-2 border-border rounded-md transition-colors duration-300',
                        'hover:border-primary-light hover:shadow-md',
                        'flex flex-col items-start md:flex-row md:items-center justify-between'
                    )}
                >
                    <div>
                        <h4 className="font-medium">{item.institution}</h4>
                        <p className="text-muted-foreground text-sm">
                            {item.city}, {item.country}
                        </p>
                    </div>
                    <fieldset className='ml-auto' disabled={isFetching || deleteMutation.isPending}>
                        <Button variant='ghost' size='icon-sm' onClick={() => onAffiliationClicked?.(item)}>
                            <Edit className='text-primary-main size-5' />
                        </Button>

                        <Button variant='ghost' size='icon-sm' onClick={() => deleteMutation.mutate(item.id)}>
                            <Trash2 className='text-destructive size-5' />
                        </Button>
                    </fieldset>
                </div>
            ))}
        </div>
    )
}

export default ShowAffiliations