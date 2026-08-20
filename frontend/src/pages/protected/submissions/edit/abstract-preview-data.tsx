import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import type { AuthorSchema } from '@/schemas/abstracts/author-schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { countries } from '@/utils/countriesInfo';
import { BookOpen, Quote } from 'lucide-react';
import React from 'react'

type AbstractPreviewDataProps = {
    abstract?: AbstractSchema
}

function AbstractPreviewData({ abstract, }: AbstractPreviewDataProps) {
    return (
        <div className="space-y-4 max-w-4xl">
            <h4
                className="text-lg md:text-2xl font-semibold leading-snug tracking-tight text-foreground"
                dangerouslySetInnerHTML={{ __html: abstract?.title || 'Not set' }}
            />

            <AuthorsPreview authors={(abstract?.authors as any || []) as AuthorSchema[]} />

            <Separator className='mb-4' />

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-main">
                    <BookOpen className="size-4" />
                    <span>Content</span>
                </div>

                <ScrollArea className='h-60 pr-2'>
                    <div
                        className={cn(
                            "text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none leading-relaxed",
                            abstract?.text ? 'text-foreground/90' : 'text-destructive'
                        )}
                        dangerouslySetInnerHTML={{ __html: abstract?.text || 'Not set' }}
                    />
                </ScrollArea>
            </div>

            <Separator className='mb-4' />

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-main">
                    <Quote className="size-4" />
                    <span>References</span>
                </div>

                <ScrollArea className='h-50'>
                    <div
                        className={cn(
                            "text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none leading-relaxed",
                            abstract?.text ? 'text-foreground/90' : 'text-destructive'
                        )}
                        dangerouslySetInnerHTML={{ __html: abstract?.references || 'Not set' }}
                    />
                </ScrollArea>
            </div>
        </div>
    )
}

export default AbstractPreviewData



type AuthorsPreviewProps = {
    authors: AuthorSchema[];
};

function AuthorsPreview({ authors }: AuthorsPreviewProps) {
    const { affiliations, authorsLine } = React.useMemo(() => {
        if (!authors || authors.length === 0) {
            return { affiliations: [], authorsLine: null };
        }

        // Conseguir las diferentes affiliaciones sin duplicados
        const seenIds = new Set<number>()
        const affiliations = authors
            .map(a => a.affiliation)
            .filter(affiliation => {
                //Si ya fue añadido quitar
                if (!affiliation || seenIds.has(affiliation.id)) {
                    return false;
                }
                // Añadir afiliación
                seenIds.add(affiliation.id);
                return true;
            })

        const authorsLine = authors.map((a, idx) => {
            // Obtener el índice de la afiliatión objetivo
            const affIndex = affiliations.findIndex((aff) => aff.id === a.affiliation?.id);
            // Inicial del autor
            const initial = a.first_name ? `${a.first_name[0]}. ` : "";
            return (
                <span key={a.id}>
                    {initial}{a.last_name}
                    {affIndex !== -1 && (
                        <sup className="text-[10px] ml-0.5 text-primary font-bold">
                            {affIndex + 1}
                        </sup>
                    )}
                    {idx < authors.length - 1 ? ", " : "."}
                </span>
            );
        });

        return { affiliations, authorsLine };
    }, [authors]);

    if (!authorsLine) return (
        <div className='text-destructive text-xs sm:text-sm'>
            No authors set
        </div>
    )

    const parseCountry = (value: string) => {
        const target = countries.find(c => c.value === value)
        return target.label
    }

    const renderAffiliations = affiliations.map((aff, idx) => (
        <p key={aff.id} className="italic leading-tight text-muted-foreground">
            <sup className="text-[8px] sm:text-xs mr-1 not-italic">{idx + 1}</sup>
            {[aff.institution, aff.city, parseCountry(aff.country)]
                .filter(Boolean)
                .join(", ")}
        </p>
    ))

    return (
        <div className='text-xs sm:text-sm'>
            <div className="leading-relaxed mb-3">
                {authorsLine}
            </div>
            {renderAffiliations}
        </div>
    );
}
