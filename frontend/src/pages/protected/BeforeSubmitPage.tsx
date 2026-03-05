import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldTitle } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useFetch } from '@/hooks/use-fetch'
import { cn } from '@/lib/utils'
import { abstractDeclaration, declarationsLabels, type AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { abstractSchema, authorSchema, presentationTypes, type AbstractSchema, type AuthorAffiliationSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import z from 'zod'


function BeforeSubmitPage() {
    const { id } = useParams()

    const { data: abstract } = useFetch<AbstractSchema>(`/abstracts/${id}/`)
    const { data: authors } = useFetch<AuthorSchema[]>(`/abstracts/${id}/authors/`)
    const { data: declarations } = useFetch<AbstractDeclarationValues>(`/abstracts/${id}/declarations/`)

    const [abstractErrors, setAbstractErrors] = useState(null)
    useEffect(() => {
        if (abstract) {
            const absParse = abstractSchema.safeParse(abstract)
            if (!absParse.success) {
                const treifiedError = z.treeifyError(absParse.error).properties
                setAbstractErrors(treifiedError)
                return
            }
        }
        setAbstractErrors(null)

    }, [abstract])


    const [declarationsErrors, setDeclarationsErrors] = useState(null)
    useEffect(() => {
        if (declarations) {
            const declParse = abstractDeclaration.safeParse(declarations)
            if (!declParse.success) {
                const treifiedError = z.treeifyError(declParse.error)?.properties
                setDeclarationsErrors(treifiedError)
                return
            }
        }
        setDeclarationsErrors(null)
    }, [declarations])

    const [authorErrors, setAuthorErrors] = useState(null)
    useEffect(() => {
        if (authors) {
            const declAuthor = abstractSchema.shape.authors.safeParse(authors)
            if (!declAuthor.success) {
                const treifiedError = z.treeifyError(declAuthor.error)?.errors
                setAuthorErrors(treifiedError)
            }
            return
        }
        setAuthorErrors(null)
    }, [authors])

    const { loading, action } = useAsyncAction(async () => {
        const payload = {
            abstract,
            authors,
            declarations
        }
        console.log(payload);
        await new Promise(r => setTimeout(r, 1000))
    })

    return (
        <div className='space-y-2'>
            <h2 className='font-semibold pb-1 border-b-2 border-b-input'>Abstract Content</h2>

            <>
                <ShowField
                    hasError={Boolean(abstractErrors?.title)}
                    errors={abstractErrors?.title?.errors}
                    name='Title'
                    value={abstract?.title}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.presentation_type)}
                    errors={abstractErrors?.presentation_type?.errors}
                    name='Presentation type'
                    value={presentationTypes.find(t => t.value === abstract?.presentation_type)?.label}
                />

                <ShowField
                    hasError={Boolean(authorErrors)}
                    errors={authorErrors}
                    name='Authors'
                    value={(authors?.length > 0 ? <AuthorsPreview authors={authors} /> : null)}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.text)}
                    errors={abstractErrors?.text?.errors}
                    name='Text'
                    value={abstract?.text}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.references)}
                    errors={abstractErrors?.references?.errors}
                    name='References'
                    value={abstract?.references}
                />

            </>

            <h2 className='font-semibold pb-1 border-b-2 border-b-input'>Declarations</h2>

            {declarations && Object.keys(declarations).map(field => (
                <div className={cn(
                    'grid grid-cols-1 sm:grid-cols-[1fr_10rem] px-3 py-2',
                    Boolean(declarationsErrors?.[field]) ? "bg-destructive/10 rounded-md" : ""
                )}>
                    <FieldContent>
                        <FieldTitle>
                            {declarationsLabels?.[field]?.title}
                        </FieldTitle>
                        <FieldDescription>
                            {declarationsLabels?.[field]?.description}
                        </FieldDescription>
                        {Boolean(declarationsErrors?.[field]) && <FieldError errors={[declarationsErrors?.[field]?.error]} />}
                    </FieldContent>

                    <Field orientation="horizontal" data-invalid={Boolean(declarationsErrors?.[field])}>
                        <span className='text-center w-full'>
                            {declarations?.[field] ? ('Yes') : ('No')}
                        </span>
                    </Field>
                </div>
            ))}

            <Button type='button' disabled={abstractErrors || declarationsErrors || loading} onClick={action}>
                Submit
            </Button>
        </div>
    )
}

export default BeforeSubmitPage


type ShowFieldProps = {
    hasError: boolean
    errors: string[]
    name: React.ReactNode
    value: React.ReactNode
}

const ShowField = ({ hasError, errors, name, value }: ShowFieldProps) => {

    return (
        <div className={cn(
            'grid grid-cols-1 sm:grid-cols-[10rem_1fr] px-3 py-2',
            hasError ? "bg-destructive/10 rounded-md" : ""
        )}>
            <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {name}
            </label>

            <div className="flex flex-col gap-2">
                <div className={cn(
                    "text-sm leading-snug",
                    hasError ? "text-destructive italic" : "text-foreground"
                )}>
                    {value || "Not set"}
                </div>

                {errors?.map((e, i) => (
                    <p key={i} className="text-[12px] font-bold text-destructive flex items-center gap-1">
                        <span className="text-[10px]">●</span> {e}
                    </p>
                ))}
            </div>
        </div>
    )
}



const AuthorsPreview = ({ authors }) => {
    const { uniqueAffiliations, authorsLine } = useMemo(() => {
        if (!authors || authors.length === 0) {
            return { uniqueAffiliations: [], authorsLine: null };
        }

        const affiliations = [];
        authors.forEach((author) => {
            const aff = author.affiliation;
            if (aff && !affiliations.some((a) => a.id === aff.id)) {
                affiliations.push(aff);
            }
        });

        const line = authors.map((a, idx) => {
            const affIndex = affiliations.findIndex((aff) => aff.id === a.affiliation?.id);
            const initial = a.first_name ? `${a.first_name[0]}. ` : "";

            return (
                <span key={a.id}>
                    {initial}{a.last_name}
                    {affIndex !== -1 && (
                        <sup className="text-[10px] ml-0.5 text-primary font-bold">
                            {affIndex + 1}
                        </sup>
                    )}
                    {idx < authors.length - 1 && ", "}
                </span>
            );
        });

        return { uniqueAffiliations: affiliations, authorsLine: line };
    }, [authors]);

    if (!authorsLine) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="text-sm font-normal leading-relaxed">
                {authorsLine}
            </div>
            <div className="flex flex-col gap-1">
                {uniqueAffiliations.map((aff, idx) => (
                    <span key={aff.id} className="text-xs mt-1 italic leading-tight">
                        <sup className="font-bold mr-1 not-italic">{idx + 1}</sup>
                        {[aff.institute, aff.department, aff.city, aff.nationality]
                            .filter(Boolean)
                            .join(", ")}
                    </span>
                ))}
            </div>
        </div>
    );
};




export const useAsyncAction = <T,>(callback: () => Promise<T>) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)
    const [data, setData] = useState<T | null>(null)

    const action = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await callback()
            setData(result)
            return result // Retornamos por si lo necesitas en el .then()
        } catch (err: any) {
            setError(err)
            throw err // Re-lanzamos para que el componente decida si hacer catch
        } finally {
            setLoading(false)
        }
    }, [callback]) // Usamos useCallback para que la referencia sea estable

    return { loading, action, error, data }
}