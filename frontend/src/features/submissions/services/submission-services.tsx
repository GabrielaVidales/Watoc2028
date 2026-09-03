import api from "@/clients/api"
import type { PaginatedRequest, PaginatedResponse } from "@/domain/pagination"
import type { AbstractSchema } from "../schemas/abstract-schemas"
import type { CreateAbstractFormValues } from "../schemas/create-abstract-schema"


async function getAllSubmissions(request: PaginatedRequest) {
    const { data: responseData } = await api.get<PaginatedResponse<AbstractSchema>>('abstracts/submissions/', {
        params: {
            limit: request.itemsPerPage,
            page: request.page,
            title: request.search,
        }
    })
    return responseData
}


async function createSubmission(data: CreateAbstractFormValues) {
    const { data: responseData } = await api.post<AbstractSchema>('abstracts/submissions/', data)
    return responseData
}



async function getSubmissionsByParticipant(request: PaginatedRequest) {
    const { data } = await api.get<PaginatedResponse<AbstractSchema>>('/participants/profiles/submissions', {
        params: {
            page: request.page,
            limit: request.itemsPerPage,
            title: request.search,
        }
    })
    return data
}


async function getSubmissionById(id: number | string) {
    const { data } = await api.get<AbstractSchema>(`/abstracts/submissions/${id}/`)
    return data
}


async function submitAbstract(id: number | string) {
    const { data } = await api.patch<AbstractSchema>(`/abstracts/submissions/${id}/submit/`)
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
    createSubmission, deleteSubmission, getAllSubmissions, getSubmissionById, getSubmissionsByParticipant, submitAbstract, updateSubmission
}

