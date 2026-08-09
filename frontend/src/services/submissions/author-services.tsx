import api from "@/clients/api"
import type { AuthorSchema } from "@/schemas/abstracts/author-schema"


type SaveAbstractAuthorsParams = {
    abstractId: number | string
    authors: AuthorSchema[]
}

const saveAbstractAuthors = async ({ abstractId, authors }: SaveAbstractAuthorsParams) => {
    if (!abstractId) {
        console.warn('No abstract ID was provided');
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

export {
    saveAbstractAuthors,
    type SaveAbstractAuthorsParams
}