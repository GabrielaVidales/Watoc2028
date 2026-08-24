import api from '@/clients/api'
import { Spinner } from '@/components/ui/spinner'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { getSubmissionById } from '@/services/submissions/submission-services'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Navigate, Outlet, useParams, type To } from 'react-router'

type Props = {
    redirectTo: To
}

function AbstractSubmittedGuard({ redirectTo = '' }: Props) {

    const { id } = useParams()
    const { data: abstract, isLoading } = useQuery<AbstractSchema>({
        enabled: !!id,
        queryKey: ['abstract', 'edit'],
        queryFn: () => getSubmissionById(id),
    })

    if (isLoading) {
        return <Spinner />
    }

    if (abstract?.status === 'submitted') {
        return <Navigate to={redirectTo} />
    }

    return (
        <Outlet />
    )
}

export default AbstractSubmittedGuard