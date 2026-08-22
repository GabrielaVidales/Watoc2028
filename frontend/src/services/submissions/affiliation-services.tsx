import api from "@/clients/api";
import type { PaginatedResponse } from "@/domain/pagination";
import { type Affiliation } from "@/schemas/abstracts/affiliation-schema";


async function getUserAffiliations(): Promise<PaginatedResponse<Affiliation>> {
    const { data } = await api.get<PaginatedResponse<Affiliation>>('/abstracts/affiliations')
    return data
}

async function getAffiliationById(id: number | string): Promise<Affiliation> {
    const { data } = await api.get<Affiliation>(`/abstracts/affiliations/${id}/`)
    return data
}

async function deleteAffiliationById(id: number | string): Promise<void> {
    const { data } = await api.delete<void>(`/abstracts/affiliations/${id}/`);
    return data;
}


export {
    getAffiliationById,
    getUserAffiliations,
    deleteAffiliationById,
}