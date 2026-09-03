import api from "@/clients/api"
import type { AuthorSchema } from "../schemas/author-schema"


async function getAbstractAuthors(abstractId: number | string) {
    const { data } = await api.get<AuthorSchema[]>(`/abstracts/submissions/${abstractId}/authors`)
    return data
}


type SaveAbstractAuthorsParams = {
    abstractId: number | string
    authors: AuthorSchema[]
}

async function saveAbstractAuthors({ abstractId, authors }: SaveAbstractAuthorsParams) {
    if (!abstractId) {
        console.warn('No abstract ID was provided')
        return
    }

    const data = {
        authors: authors.map(a => ({
            ...a,
            affiliation_id: a.affiliation.id,
        }))
    }

    const { data: response } = await api.patch(`/abstracts/submissions/${abstractId}/authors/`, data)
    return response
}

async function deleteAuthor(id: number) {
    const { data: response } = await api.delete<void>(`/abstracts/authors/${id}/`)
    return response
}

export {
    deleteAuthor, getAbstractAuthors,
    saveAbstractAuthors, type SaveAbstractAuthorsParams
}

