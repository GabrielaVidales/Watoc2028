import api from "@/clients/api"
import type { PaginatedRequest } from "@/domain/pagination"
import { filtersToQueryParams } from "@/utils/filter-operations"


async function getAllReviews(requestParams: PaginatedRequest) {
    const { data } = await api.get('/reviews/reviews/', {
        params: {
            itemsPerPage: requestParams.itemsPerPage,
            page: requestParams.page,
            search: requestParams.search,
            ...filtersToQueryParams(requestParams.filters),
        }
    })
    return data
}

async function getReview(id: number) {
    const { data } = await api.get(`/reviews/reviews/${id}/`)
    return data
}

async function updateReview(data) {
    const { data: responseData } = await api.patch(`/reviews/reviews/${data.id}/`, data);
    return responseData;
}

async function deleteReview(id: number) {
    await api.delete(`/reviews/reviews/${id}/`);
}


export {
    getReview,
    getAllReviews,
    updateReview,
    deleteReview,
}