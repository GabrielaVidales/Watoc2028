import { AbstractData } from '@/components/AbstractData'
import { useFetch } from '@/hooks/use-fetch'
import { useMutation } from '@/hooks/use-mutation'
import { routes } from '@/routes/routes'
import { abstractDeclarationSchema, type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { abstractSchema, validateAuthorsSchema, type AbstractSchema, type AuthorSchema } from '@/schemas/abstracts/abstract-schemas'
import { isAxiosError } from 'axios'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import z from 'zod'


function BeforeSubmitPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: abstract, fetchData: fetchAbstract } = useFetch<AbstractSchema>(`/abstracts/submissions/${id}/`)
    const { data: authors } = useFetch<AuthorSchema[]>(`/abstracts/submissions/${id}/authors/`)
    const { data: declarations } = useFetch<AbstractDeclarationValues>(`/abstracts/submissions/${id}/declarations/`)

    const abstractErrors = useMemo(() => {
        if (!abstract) return [];
        const parse = abstractSchema.safeParse(abstract);
        return parse.success ? null : z.treeifyError(parse.error).properties;
    }, [abstract]);

    const declarationsErrors = useMemo(() => {
        if (!declarations) return [];
        const parse = abstractDeclarationSchema.safeParse(declarations);
        return parse.success ? null : z.treeifyError(parse.error)?.properties;
    }, [declarations]);

    const authorErrors = useMemo(() => {
        if (!authors) return [];
        const parse = validateAuthorsSchema.safeParse({ authors });
        if (!parse.success) {
            const treeErrors = z.treeifyError(parse.error)
            return treeErrors?.errors.length > 0 ? treeErrors.errors : treeErrors?.properties?.authors?.errors
        }
        return null
    }, [authors]);

    const { mutate, loading } = useMutation()

    const sendSubmission = async () => {
        try {
            const res = await mutate<any>('post', `/abstracts/submissions/${id}/submit/`)
            await fetchAbstract()
            navigate(routes.users.submissions.summary)
            if (import.meta.env.DEV) {
                console.log(res);
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    return (
        <div className='max-w-full py-8 space-y-8'>

            <AbstractData abstract={abstract} authors={authors} declarations={declarations}
                errors={{
                    abstract: abstractErrors,
                    authors: authorErrors,
                    declarations: declarationsErrors
                }}
            />
        </div>
    )
}

export default BeforeSubmitPage
