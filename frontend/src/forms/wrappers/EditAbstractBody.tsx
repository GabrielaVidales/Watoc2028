import React, { useEffect, useRef } from 'react'
import AbstractForm, { type AbstractFormState } from '../AbstractForm'
import { useParams } from 'react-router'
import { useFetch } from '@/hooks/use-fetch'
import type { AbstractSchema } from '@/schemas/abstract-schemas'

function EditAbstractBody() {
    const ref = useRef<AbstractFormState>(null)
    const { id } = useParams()
    const { data, fetchData } = useFetch<AbstractSchema>(`/abstracts/${id}/`)

    return (
        <div className='w-full space-y-5 p-5'>
            <h2 className='text-2xl font-semibold'>Abstract Body</h2>
            <AbstractForm abstract={data} onSubmit={async () => { await fetchData() }} ref={ref} />
        </div>

    )
}

export default EditAbstractBody