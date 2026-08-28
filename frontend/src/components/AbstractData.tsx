import { InfoAlert } from '@/components/InfoAlert'
import { FieldContent, FieldDescription, FieldError, FieldTitle } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { declarationsLabels } from '@/schemas/abstract-declaration-schema'
import { type AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { renderHTMLString } from '@/utils/tsx_utils'
import { CircleCheckBig } from 'lucide-react'
import React, { useMemo } from 'react'
import { Badge } from './ui/badge'

// OLD


export const presentationTypes = [
    {
        value: 'oral',
        label: 'Oral Presentation'
    },
    {
        value: 'poster',
        label: 'Poster Presentation'
    },
    {
        value: '',
        label: 'Not Set'
    },
]


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

    return (
        <div className='space-y-6'>
            {errors && (
                <div className="animate-in fade-in-50 duration-200">
                    {!hasErrors ? (
                        <InfoAlert
                            icon={<CircleCheckBig className="size-4" />}
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
                    )}
                </div>
            )}

            <div className="space-y-5">

                <ShowField
                    hasError={Boolean(abstractErrors?.title)}
                    errors={abstractErrors?.title?.errors}
                    name=''
                    value={
                        <h1 className='text-lg font-bold text-foreground leading-snug border-l-3 mr-2 border-primary pl-3 py-0'>
                            {renderHTMLString(abstract?.title || 'Untitled Abstract')}
                        </h1>
                    }
                />

                <ShowField
                    hasError={Boolean(authorErrors)}
                    errors={Array.isArray(authorErrors) ? authorErrors : authorErrors?.errors}
                    name='Authors & Affiliations'
                    value={
                        <div className='p-3.5 py-2'>
                            {authors?.length > 0 ? <AuthorsPreview authors={authors} /> : 'No authors included'}
                        </div>
                    }
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.presentation_type)}
                    errors={abstractErrors?.presentation_type?.errors}
                    name='Presentation Method'
                    value={
                        <div className='px-3.5 pt-2'>
                            {
                                abstract?.presentation_type ? (
                                    <Badge variant="outline" className="capitalize bg-background font-medium px-2.5 py-0.5 text-xs text-muted-foreground border-muted-foreground/30">
                                        {presentationTypes.find(t => t.value === abstract?.presentation_type)?.label}
                                    </Badge>
                                ) : 'Not set'
                            }
                        </div>
                    }
                />

                <ShowField
                    hasError={Boolean(abstractErrors?.text)}
                    errors={abstractErrors?.text?.errors}
                    name='Abstract Body'
                    value={
                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed tracking-normal bg-muted/10 p-3.5 rounded-xl border border-muted/50">
                            {renderHTMLString(abstract?.text || 'Not set')}
                        </div>
                    }
                />

                {abstract?.references && (
                    <ShowField
                        hasError={Boolean(abstractErrors?.references)}
                        errors={abstractErrors?.references?.errors}
                        name='References'
                        value={
                            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed tracking-normal bg-muted/10 p-3.5 rounded-xl border border-muted/50">
                                {renderHTMLString(abstract.references)}
                            </div>
                        }
                    />
                )}
            </div>

            <div className="space-y-3 pt-2">
                <h3 className='text-sm font-semibold tracking-wider uppercase text-muted-foreground pb-1.5 border-b'>
                    Required Declarations
                </h3>

                <div className="divide-y divide-border/60 border rounded-xl overflow-hidden bg-background">
                    {declarations && Object.keys(declarations).map(field =>

                        field === 'abstract_id' ? null :

                            (
                                <div key={field} className={cn(
                                    'flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors',
                                    Boolean(declarationsErrors?.[field]) ? "bg-destructive/5" : "hover:bg-muted/30"
                                )}>
                                    <FieldContent className="space-y-1">
                                        <FieldTitle className="text-sm font-semibold tracking-tight text-foreground">
                                            {declarationsLabels?.[field]?.title}
                                        </FieldTitle>
                                        <FieldDescription className='text-xs text-muted-foreground max-w-xl leading-normal'>
                                            {declarationsLabels?.[field]?.description}
                                        </FieldDescription>
                                        {Boolean(declarationsErrors?.[field]) && (
                                            <FieldError errors={[declarationsErrors?.[field]?.error]} className="text-xs mt-1" />
                                        )}
                                    </FieldContent>

                                    <div className="flex items-center shrink-0 sm:ml-auto">
                                        <span className={cn(
                                            "text-xs font-bold px-3 py-1.5 rounded-full border tracking-wide shadow-sm min-w-18 text-center",
                                            declarations?.[field]
                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                : "bg-muted text-muted-foreground border-transparent"
                                        )}>
                                            {declarations?.[field] ? 'Accepted' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </div>
    )
}


type ShowFieldProps = {
    hasError: boolean
    errors: string[]
    name: React.ReactNode
    value: React.ReactNode
}

const ShowField = ({ hasError, errors, name, value }: ShowFieldProps) => {
    return (
        <div className={cn(hasError ? "bg-destructive/10 rounded-md" : "")}>
            {name && (
                <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {name}
                </label>
            )}

            <div className="flex flex-col gap-2 font-serif">
                <div className={cn(
                    "text-sm leading-snug wrap-anywhere",
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
            <div>
                {uniqueAffiliations.map((aff, idx) => (
                    <p key={aff.id} className="text-xs mt-1 italic leading-tight">
                        <sup className="text-[10px] font-bold mr-1 not-italic">{idx + 1}</sup>
                        {[aff.institution, aff.city, aff.country]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                ))}
            </div>
        </div>
    );
};
