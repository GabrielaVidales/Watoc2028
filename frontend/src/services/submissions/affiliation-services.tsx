import api from "@/clients/api";
import { notify } from "@/components/custom/notify";
import type { PaginatedResponse } from "@/domain/pagination";
import { type Affiliation } from "@/schemas/abstracts/affiliation-schema";
import type { AxiosError } from "axios";


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

async function createAffiliation(affiliation: Affiliation & { user_id: number }) {
    const { data } = await api.post<Affiliation>('/abstracts/affiliations/', affiliation);
    return data
}

async function updateAffiliation(affiliation: Affiliation) {
    const { id, ...body } = affiliation;
    const { data } = await api.patch<Affiliation>(`/abstracts/affiliations/${id}/`, body);
    return data;
}


const handleApiError = (error: AxiosError<any>) => {
    const errors = Object.entries<string[]>(error.response.data)

    const liEle = errors.map(([field, value], i) => {
        const fieldName = field === 'non_field_errors' ? 'Error' : field
        const message = value.join('. ')
        return (<li key={i}><b>{fieldName}</b>: {message}</li>)
    })

    notify.destructive('Something went wrong!', {
        description: (
            <div>
                <p>The server responded with an error:</p>
                <ul className='list-disc list-inside'>
                    {liEle}
                </ul>
            </div>
        ),
    })
}


export {
    createAffiliation,
    deleteAffiliationById,
    getAffiliationById,
    getUserAffiliations, handleApiError, updateAffiliation
};

