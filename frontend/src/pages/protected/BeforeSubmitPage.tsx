import React, { useMemo } from 'react'
import z from 'zod'
import type { EditAbstractCallbacks } from './EditAbstractPage'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/use-fetch'
import { abstractDeclarationSchema, type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { abstractSchema, validateAuthorsSchema, type AbstractSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { useMutation } from '@/hooks/use-mutation'
import { isAxiosError } from 'axios'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { AbstractData } from '@/components/AbstractData'
import { urls } from '@/routes/routes'


function BeforeSubmitPage({ onStepBack, onStepForward }: EditAbstractCallbacks) {
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
            navigate(urls.users.viewAbstracts)
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
        <div className='space-y-4'>

            <AbstractData abstract={abstract} authors={authors} declarations={declarations}
                errors={{
                    abstract: abstractErrors,
                    authors: authorErrors,
                    declarations: declarationsErrors
                }}
            />

            <Separator />

            <fieldset disabled={loading} className='flex justify-between items-start gap-2 w-full'>
                <Button type='button' onClick={onStepBack}>
                    <ChevronLeft /> Back
                </Button>

                <div className='flex flex-col'>
                    {abstract?.status === 'submitted' ? (
                        <Button>
                            Abstract Submitted
                        </Button>
                    ) : (
                        <Button
                            type='button'
                            onClick={sendSubmission}
                            disabled={!!abstractErrors || !!declarationsErrors || !!authorErrors}
                        >
                            {loading ? <Spinner /> : <Save />}
                            Save Changes
                        </Button>
                    )}

                    {(!!abstractErrors || !!declarationsErrors || !!authorErrors) && (
                        <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-top-1">
                            No changes were made.
                        </p>
                    )}
                </div>

                <Button type='button' onClick={onStepForward}>
                    Next <ChevronRight />
                </Button>
            </fieldset>
        </div>
    )
}

export default BeforeSubmitPage
