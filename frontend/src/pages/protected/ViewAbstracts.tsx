import React, { useEffect, useState } from 'react'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { BookType, CircleAlert, Inbox, Pencil, Plus, Search, Send, Trash2, TriangleAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { urls } from '@/routes/routes'
import { useProfiles } from '@/hooks/use-profiles'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstract-schemas'
import { isAxiosError } from 'axios'
import { Badge } from '@/components/ui/badge'
import { InfoAlert } from '@/components/InfoAlert'
import { useMutation } from '@/hooks/use-mutation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { formatDate } from '@/utils/formatDate'

function ViewAbstracts() {
    const navigate = useNavigate()
    const { profile, fetchProfile } = useProfiles()
    const { loading, mutate } = useMutation()

    const handleCreate = async () => {
        try {
            const response = await axiosClient.post<AbstractSchema>('abstracts/')
            navigate(urls.users.editAbstract.build({ id: response.data.id }))
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await mutate<never>('delete', `/abstracts/${id}/`)
            await fetchProfile()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    console.log(typeof urls.users.previewAbstract.build);
    


    type Author = {
        full_name: string
        aff_index: number
    }
    type Affiliation = {
        index: number
        text: string
    }
    type AbstractContext = {
        authors_list: Author[]
        affiliations_list: Affiliation[]
    }
    const [abstractDetails, setAbstractDetails] = useState<Record<number, AbstractContext>>({})
    useEffect(() => {
        if (profile?.participant?.abstracts) {
            const fetchAll = async () => {
                const allResults = await Promise.all(
                    profile.participant.abstracts.map(abstract =>
                        axiosClient.get(`/abstracts/${abstract.id}/authors-preview`)
                    )
                )
                const map = {}
                allResults.forEach((res, i) => {
                    map[profile.participant.abstracts[i].id] = res.data
                })
                setAbstractDetails(map)
            }
            fetchAll()
        }
    }, [profile])


    const getAuthorPreview = (authors: Author[]) => {
        return authors.map((author, i) => (
            <span key={i}>
                {author.full_name}
                <sup>{author.aff_index}</sup>
                {i < authors.length - 1 && ", "}
            </span>
        ))
    }

    const getAffiliationPreview = (affiliations: Affiliation[]) => {
        return affiliations.map((aff, i) => (
            <div key={i}>
                <sup>{aff.index}</sup>
                {aff.text}
                {i < affiliations.length - 1 && ", "}
            </div>
        ))
    }

    return (
        <div className='w-full max-w-5xl gap-3 p-3 mx-auto'>
            <div className='min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 sm:p-5 md:p-7 rounded-lg shadow-lg flex flex-col gap-5'>
                    <fieldset disabled={loading} className='w-full py-9 pt-4 space-y-5'>
                        <div className='flex flex-col justify-end items-center gap-3 md:flex-row md:justify-between'>
                            <h2 className='text-2xl font-semibold'>Abstract submission</h2>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button>
                                        <Plus />
                                        New Submission
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent size="sm">
                                    <AlertDialogHeader className="space-y-3">
                                        <AlertDialogTitle className="flex items-center gap-2 text-lg">
                                            <Plus className="w-5 h-5 text-primary" />
                                            Create a New Submission
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                            This will create a new <b>draft submission</b> where you can
                                            enter your abstract, authors, and additional information before submitting it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>No</AlertDialogCancel>
                                        <AlertDialogAction type='button' onClick={handleCreate}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <InfoAlert
                            title="Abstract submission deadline: June 10, 2026"
                            messages={[
                                'Read our Abstract Submission Guideline',
                            ]}
                        />

                        {profile?.participant?.abstracts.map((abstract) => (
                            <Card key={abstract.id} className="group hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-col-reverse items-stretch  sm:flex-row sm:items-start sm:justify-between   gap-4">
                                    <CardTitle className="text-lg font-semibold leading-tight">
                                        {abstract.title ? (
                                            <Link to={urls.users.previewAbstract.build({ id: 22 })} className="block hover:underline">
                                                <BookType className="inline-block mr-2 mb-1 shrink-0 size-5" />
                                                {abstract.title}
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 text-destructive">
                                                <CircleAlert className="shrink-0 size-5" />
                                                No title set
                                            </span>
                                        )}
                                    </CardTitle>

                                    <Badge className="self-end flex items-center uppercase gap-1 px-3 py-1">
                                        <Inbox className="size-3 stroke-[2.5]" />
                                        {abstract.status || 'Not set'}
                                    </Badge>
                                </CardHeader>
                                <CardContent className='text-muted-foreground text-sm space-y-3'>
                                    <CardDescription className="text-sm">
                                        <p className='font-semibold'>Preferred presentation:</p>
                                        {presentationTypes?.find((p) => p.value === abstract.presentation_type)?.label || (
                                            <span className="flex items-center gap-1 text-destructive">
                                                <CircleAlert className="size-3.5 shrink-0" />
                                                Not set
                                            </span>
                                        )}
                                    </CardDescription>
                                    <CardDescription className="text-sm">
                                        <p className='font-semibold'>Authors:</p>
                                        {abstractDetails[abstract.id]?.authors_list?.length > 0 ? (
                                            <div>
                                                <p>
                                                    {abstractDetails[abstract.id]?.authors_list && (
                                                        getAuthorPreview(abstractDetails[abstract.id].authors_list)
                                                    )}
                                                </p>
                                                <div>
                                                    {abstractDetails[abstract.id]?.affiliations_list && (
                                                        getAffiliationPreview(abstractDetails[abstract.id].affiliations_list)
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-2 text-destructive">
                                                <CircleAlert className="size-4 shrink-0" />
                                                No authors set
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="flex flex-wrap items-center justify-between gap-4 pt-0">
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>Updated: {formatDate(abstract.last_update)}</p>
                                        <p>Created: {formatDate(abstract.created_at)}</p>
                                    </div>

                                    <div className="flex items-center ml-auto gap-2">
                                        <Button variant="outline" size="sm" onClick={() => navigate(urls.users.previewAbstract.build({ id: abstract.id }))}>
                                            <Search className="size-4" />
                                            <span className="max-sm:hidden">Preview</span>
                                        </Button>

                                        {abstract.status !== 'submitted' && (
                                            <Button variant="outline" size="sm" onClick={() => navigate(urls.users.editAbstract.build({ id: abstract.id }))}>
                                                <Pencil className="size-4" />
                                                <span className="max-sm:hidden">Edit</span>
                                            </Button>
                                        )}

                                        {abstract.status !== 'submitted' && (
                                            <Button variant="outline" size="sm" onClick={() => navigate(urls.users.editAbstract.build({ id: abstract.id }) + '?action=submit')}>
                                                <Send className="size-4" />
                                                <span className="max-sm:hidden">Submit</span>
                                            </Button>
                                        )}

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    {loading ? (
                                                        <Spinner />
                                                    ) : (
                                                        <Trash2 className="size-4 text-destructive" />
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent size='sm'>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="p-3 bg-destructive/10 rounded-full mb-2">
                                                        <TriangleAlert className='size-8 text-destructive' />
                                                    </AlertDialogTitle>
                                                    <AlertDialogTitle>Delete Abstract?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. The abstract will be
                                                        permanently deleted.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction variant='destructive' onClick={async () => await handleDelete(abstract.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </fieldset>
                </div>
            </div>
        </div>
    )
}

export default ViewAbstracts