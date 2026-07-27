import api from '@/clients/api'
import { editAbstractSchema, type EditAbstractFormValues } from '@/schemas/abstracts/edit-abstract-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'

type Props = {}

function AbstractContentForm({ }: Props) {
    const { id } = useParams()

    const queryClient = useQueryClient()

    const { data: abstract, isLoading } = useQuery({
        queryKey: ['abstract'],
        queryFn: async () => {
            const { data } = await api.get(`/abstracts/submissions/${id}/`)
            return data
        }
    })

    const { control, handleSubmit, reset } = useForm<EditAbstractFormValues>({
        resolver: zodResolver(editAbstractSchema),
        mode: 'onChange',
        defaultValues: {
            id: null,
            presentation_type: null,
            references: '',
            text: '',
            title: ''
        }
    })

    const saveMutation = useMutation({
        mutationFn: async (data: EditAbstractFormValues) => {
            const { data: response } = await api.patch(`/abstracts/submissions/${id}/`, data)
            return response
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abstract', id] }),
        onError: error => {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.error(error.response.data);
                }
            } else if (import.meta.env.DEV) {
                console.error(error);
            }
        }
    })

    const onFormSubmit = handleSubmit(
        async (data) => {
            await saveMutation.mutateAsync(data)
        },
        async (data) => {
            if (import.meta.env.DEV) {
                console.error(data)
            }
        }
    )

    useEffect(() => {
        if (!isLoading && abstract) {
            reset({
                presentation_type: abstract.presentation_type,
                title: abstract.title,
                references: abstract.references,
                text: abstract.text,
            })
        }
    }, [abstract])


    return (
        <form onSubmit={onFormSubmit} id='abstract-content-form'>


        </form>
    )
}

export default AbstractContentForm