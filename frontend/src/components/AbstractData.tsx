import React, { useMemo } from 'react'
import { FieldContent, FieldDescription, FieldError, FieldTitle } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { declarationsLabels } from '@/schemas/abstract-declaration-schema'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstract-schemas'
import { CircleCheckBig } from 'lucide-react'
import { InfoAlert } from '@/components/InfoAlert'
import { renderHTMLString } from '@/utils/tsx_utils'


export type AbstractDataProps = {
    abstract: AbstractSchema
    authors: any[]
    declarations: any
    errors?: {
        abstract?: any
        authors?: any
        declarations?: any
    }
}

export function AbstractData({ abstract, authors, declarations, errors }: AbstractDataProps) {

    const abstractErrors = errors?.abstract;
    const authorErrors = errors?.authors;
    const declarationsErrors = errors?.declarations;
    const hasErrors = !!(abstractErrors || authorErrors || declarationsErrors);

    const referencesEmpty = abstract?.references?.trim()?.length === 0
    const referencesList = referencesEmpty ? null : abstract?.references?.split('\n') || []

    return (
        <div className='space-y-6'>
            {errors && (
                !hasErrors ? (
                    <InfoAlert
                        icon={<CircleCheckBig />}
                        title='You are almost done!'
                        messages={["The information is valid and ready to be saved."]}
                        variant='success'
                    />
                ) : (
                    <InfoAlert
                        title='Please review the highlighted section(s).'
                        variant='destructive'
                        messages={[
                            abstractErrors && "Check abstract details (title, text, or references).",
                            authorErrors && "Check the authors list.",
                            declarationsErrors && "Check the required declarations.",
                        ].filter(Boolean) as string[]}
                    />
                )
            )}

            <section className="space-y-3">
                <h2 className='font-semibold pb-1 border-b-2 border-b-input'>Abstract Content</h2>

                <ShowField
                    hasError={Boolean(abstractErrors?.title)}
                    errors={abstractErrors?.title?.errors}
                    name='Title'
                    value={renderHTMLString(abstract?.title || '')}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.presentation_type)}
                    errors={abstractErrors?.presentation_type?.errors}
                    name='Presentation type'
                    value={presentationTypes.find(t => t.value === abstract?.presentation_type)?.label}
                />

                <ShowField
                    hasError={Boolean(authorErrors)}
                    errors={Array.isArray(authorErrors) ? authorErrors : authorErrors?.errors}
                    name='Authors'
                    value={authors?.length > 0 ? <AuthorsPreview authors={authors} /> : null}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.text)}
                    errors={abstractErrors?.text?.errors}
                    name='Text'
                    value={renderHTMLString(abstract?.text || '')}
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.references)}
                    errors={abstractErrors?.references?.errors}
                    name='References'
                    value={referencesList?.length === 0 ? null : referencesList?.map((p: string, i: number) => (
                        <p key={i} className='mb-2 text-sm'>{p}</p>
                    ))}
                />
            </section>

            <section className="space-y-3">
                <h2 className='font-semibold pb-1 border-b-2 border-b-input'>Declarations</h2>
                {declarations && Object.keys(declarations).map(field => (
                    <div key={field} className={cn(
                        'grid grid-cols-1 sm:grid-cols-[1fr_10rem] px-3 py-2 border-b border-border/40 last:border-0',
                        Boolean(declarationsErrors?.[field]) ? "bg-destructive/10 rounded-md" : ""
                    )}>
                        <FieldContent>
                            <FieldTitle className="text-sm font-medium">
                                {declarationsLabels?.[field]?.title}
                            </FieldTitle>
                            <FieldDescription className='text-xs'>
                                {declarationsLabels?.[field]?.description}
                            </FieldDescription>
                            {Boolean(declarationsErrors?.[field]) && (
                                <FieldError errors={[declarationsErrors?.[field]?.error]} />
                            )}
                        </FieldContent>

                        <div className="flex items-center justify-end">
                            <span className={cn(
                                "text-sm font-bold px-3 py-1 border-input border-2 rounded-full uppercase tracking-tighter",
                                declarations?.[field] ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                            )}>
                                {declarations?.[field] ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}



// #region
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
                    "text-balance text-sm leading-snug wrap-anywhere",
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
// #endregion