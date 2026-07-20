import axiosClient from '@/clients/axiosClient'
import { createFilter, Filters, type Filter, type FilterFieldConfig } from '@/components/reui/filters'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { UserSchema } from '@/schemas/user-schemas'
import { useQuery } from '@tanstack/react-query'
import { FunnelXIcon, ListFilterIcon, User2 } from 'lucide-react'
import React, { useCallback, useState } from 'react'

function ManageReviewsPage() {

    const { data, isLoading } = useQuery({
        queryKey: ['reviewers', 'all'],
        queryFn: async () => {
            const { data } = await axiosClient.get<UserSchema>('/reviews/users')
            return data
        }
    })




    const fields: FilterFieldConfig[] = [
        {
            key: 'assignee',
            label: 'Assignee',
            icon: <User2 className='size-3.5' />,
            type: "multiselect",
            className: "w-[200px]",
            options: []
        }
    ]


    const [filters, setFilters] = useState<Filter[]>([
        createFilter('Assignee', 'is_any_of', [])
    ])


    const handleFiltersChange = useCallback((filters: Filter[]) => {
        setFilters(filters)
    }, [])

    if (isLoading) {
        return (
            <div>
                <Spinner />
            </div>
        )
    }
    console.log(data);

    return (
        <div className="flex grow content-start items-start gap-2.5 self-start">
            <div className="flex-1">
                <Filters
                    filters={filters}
                    fields={fields}
                    trigger={
                        <Button variant="outline" size="icon">
                            <ListFilterIcon />
                        </Button>
                    }
                    onChange={handleFiltersChange}
                />
            </div>
            {filters.length > 0 && (
                <Button variant="outline" onClick={() => setFilters([])}>
                    <FunnelXIcon />
                    Clear
                </Button>
            )}
        </div>
    )
}

export default ManageReviewsPage