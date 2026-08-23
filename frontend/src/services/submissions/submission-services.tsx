import api from "@/clients/api"
import type { PaginatedRequest, PaginatedResponse } from "@/domain/pagination"
import type { AbstractSchema } from "@/schemas/abstracts/abstract-schemas"
import type { CreateAbstractFormValues } from "@/schemas/abstracts/create-abstract-schema"


async function getUserSubmissions(request: PaginatedRequest) {
    const { data: responseData } = await api.get<PaginatedResponse<AbstractSchema>>('abstracts/submissions/', {
        params: {
            limit: request.itemsPerPage,
            page: request.page,
        }
    })
    return responseData
}


async function createSubmission(data: CreateAbstractFormValues) {
    const { data: responseData } = await api.post<AbstractSchema>('abstracts/submissions/', data)
    return responseData
}


async function getSubmissionById(id: number | string) {
    const { data } = await api.get<AbstractSchema>(`/abstracts/submissions/${id}/`)
    return data
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
    getUserSubmissions,
    getSubmissionById,
    createSubmission,
    updateSubmission,
    deleteSubmission,
}