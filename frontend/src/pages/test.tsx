import ShowAffiliations from '@/components/ShowAffiliations'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import AffiliationForm from '@/forms/AffiliationForm'
import type { Affiliation } from '@/schemas/affiliation-schema'
import { Plus, X } from 'lucide-react'
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Sockets from './socket'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AuthorForm, AuthorFormContent } from '@/forms/AbstractAuthorForm'
import ShowAuthorsComponent from '@/components/ShowAuthors'
import type { AuthorSchema } from '@/schemas/author-schema'

function TestPage() {

    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] w-full gap-4 p-2'>
                <Card className='w-full mx-auto'>
                    <CardHeader>
                        <CardTitle>Manage Affiliations</CardTitle>
                        <CardDescription>
                            View, create, edit, or remove affiliation records for your organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='pr-2 border-y'>
                        <ScrollArea className="h-100 space-y-4 py-4 text-sm leading-relaxed">
                            <ShowAffiliations />
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className='w-full mx-auto'>
                    <CardHeader>
                        <CardTitle>Manage Authors</CardTitle>
                        <CardDescription>
                            View, create, edit, or remove author records for your submission.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='border-y p-0'>
                        <ScrollArea className="h-100 space-y-4 p-1 sm:p-3 md:p-5 text-sm leading-relaxed">
                            <ShowAuthorsComponent />
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Sockets />
            </div>
        </>
    )
}

export default TestPage