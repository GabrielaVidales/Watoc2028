import { DataTable } from '@/components/ui/data-table'
import { useAuth } from '@/contexts/AuthContext'
import type { PaginatedResponse } from '@/domain/pagination'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { getSubmissionById, getUserSubmissions } from '@/services/submissions/submission-services'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { columns } from './columns'
import { PaginationController } from '@/components/custom/pagination-controller'


function SubmissionsSummaryTable() {
    const { user } = useAuth()

    const [page, setPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(5)
    const { data, isLoading } = useQuery<PaginatedResponse<AbstractSchema>>({
        queryKey: ['abstracts', user.id, page, itemsPerPage],
        queryFn: () => getUserSubmissions({ page, itemsPerPage }),
        refetchOnWindowFocus: false,
    })

    console.log(data);

    const abstracts = data?.results ? data.results : []

    return (
        <div className='space-y-5'>
            <DataTable columns={columns} data={abstracts} minRows={itemsPerPage} />

            <PaginationController
                page={page}
                onPageChange={setPage}
                totalPages={data?.meta?.total_pages || 0}
            />
        </div>
    )
}

export default SubmissionsSummaryTable