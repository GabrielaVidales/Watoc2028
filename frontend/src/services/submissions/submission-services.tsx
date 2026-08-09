import api from "@/clients/api"
import type { AbstractSchema } from "@/schemas/abstracts/abstract-schemas"
import type { CreateAbstractFormValues } from "@/schemas/abstracts/create-abstract-schema"


async function createSubmission(data: CreateAbstractFormValues) {
    const { data: responseData } = await api.post<AbstractSchema>('abstracts/submissions/', data)
    return responseData
}


export type UpdateParams = {
    id: number | string
    data: AbstractSchema
}

async function updateSubmission({ data, id }: UpdateParams) {
    const { data: response } = await api.patch(`/abstracts/submissions/${id}/`, data)
    return response
}

async function deleteSubmission(id: number | string) {
    await api.delete(`/abstracts/submissions/${id}/`)
}


export {
    updateSubmission,
    createSubmission,
    deleteSubmission,
}