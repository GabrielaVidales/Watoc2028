import React, { useState } from 'react'
import axiosClient from '@/clients/axiosClient'
import { Button } from '@/components/ui/button'
import { ArrowRight, CircleAlert, Download, Eye, FileText, Inbox, Pencil, Plus, Send, Trash2, TriangleAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { urls } from '@/routes/routes'
import { useProfiles } from '@/hooks/use-profiles'
import { presentationTypes, type AbstractSchema, type AuthorSchema } from '@/schemas/abstract-schemas'
import { isAxiosError } from 'axios'
import { Badge } from '@/components/ui/badge'
import { InfoAlert } from '@/components/InfoAlert'
import { useMutation } from '@/hooks/use-mutation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { formatDate } from '@/utils/formatDate'
import { renderHTMLString } from '@/utils/tsx_utils'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { useFetch } from '@/hooks/use-fetch'
import type { AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { AbstractData } from '@/components/AbstractData'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"

function ViewAbstracts() {
    const navigate = useNavigate()
    const { profile, fetchProfile } = useProfiles()
    const { loading, mutate } = useMutation()

    const handleDelete = async (id: number) => {
        try {
            await mutate<never>('delete', `/abstracts/submissions/${id}/`)
            await fetchProfile()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }


    const handlePreview = async (id: number | string, name: string = 'abstract') => {
        try {
            const response = await axiosClient.get<Blob>(`/abstracts/submissions/${id}/preview`, {
                responseType: 'blob',
            })
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');

            const doc = new DOMParser().parseFromString(name, 'text/html');
            const title = doc.documentElement.textContent
            const textoPlano = title.replace(/<\/?[^>]+(>|$)/g, "");

            link.href = href;
            link.setAttribute('download', `${textoPlano}_preview.pdf`);
            link.click();
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }


    const [activeAbstract, setActiveAbstract] = useState<AbstractSchema | null>()

    return (
        <div className='w-full max-w-5xl mx-auto'>
            <Breadcrumb className='mb-8'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={urls.users.profile}>
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Abstract Submissions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <fieldset disabled={loading} className='w-full space-y-5'>
                <div className='flex flex-col justify-end items-center gap-3 md:flex-row md:justify-between'>
                    <h2 className='text-2xl font-semibold'>Abstract submission</h2>
                    <CreateAbstractDialog />
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-3 items-start'>

                    <div className='md:col-span-2 space-y-4'>
                        {profile?.participant?.abstracts.map((abstract) => (
                            <Card key={abstract.id} className="group outline-2 outline-transparent hover:shadow-md hover:outline-primary-light transition-all duration-300 gap-3">
                                <CardHeader className="flex flex-col items-stretch sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className='space-y-2'>
                                        <CardTitle className="text-lg font-semibold leading-tight">
                                            {abstract.title ? (
                                                <div onClick={() => setActiveAbstract(abstract)} className="cursor-pointer hover:underline">
                                                    {renderHTMLString(abstract.title)}
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-2 text-destructive">
                                                    <CircleAlert className="shrink-0 size-5" />
                                                    Undefined title
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            {presentationTypes?.find((p) => p.value === abstract.presentation_type)?.label || (
                                                <span className="flex items-center gap-1 text-destructive">
                                                    <CircleAlert className="size-3.5 shrink-0" />
                                                    Presentation type not set
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <CardAction className='max-sm:hidden'>
                                        <Badge className="bg-primary-dark self-end flex items-start uppercase gap-1 px-3 py-1">
                                            <Inbox className="size-4 stroke-2" />
                                            STATUS: {abstract.status || 'Not set'}
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex flex-wrap items-center justify-between gap-4 pt-0">
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>Created: {formatDate(abstract.created_at)}</p>
                                        <p>Last update: {formatDate(abstract.last_update)}</p>
                                    </div>

                                    <div className="flex items-center ml-auto gap-2">
                                        <Button variant="outline" size="icon-lg" onClick={() => setActiveAbstract(abstract)}>
                                            <Eye className='size-5' />
                                        </Button>

                                        {abstract.status !== 'submitted' && (
                                            <Button variant="outline" size="icon-lg" onClick={() => navigate(urls.users.editAbstract.build({ id: abstract.id }))}>
                                                <Pencil className="size-5" />
                                            </Button>
                                        )}

                                        {abstract.status !== 'submitted' && (
                                            <Button variant="outline" size="icon-lg" onClick={() => navigate(urls.users.editAbstract.build({ id: abstract.id }) + '?action=submit')}>
                                                <Send className="size-5" />
                                            </Button>
                                        )}

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon">
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

                                    <CardAction className='sm:hidden ml-auto'>
                                        <Badge className="bg-primary-dark self-end flex items-start uppercase gap-1 px-3 py-1">
                                            <Inbox className="size-4 stroke-2" />
                                            STATUS: {abstract.status || 'Not set'}
                                        </Badge>
                                    </CardAction>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className='md:col-span-1 sticky top-6'>
                        <InfoAlert
                            title="Abstract submission deadline: To be announced"
                            messages={[
                                <p key="guideline-text">
                                    Please review our{" "}
                                    <Link to={urls.home.abstractSubmission} className="inline-flex items-center gap-1 font-medium hover:underline focus:underline focus:outline-none">
                                        Abstract Submission Guideline
                                    </Link>{" "}
                                    before submitting.
                                </p>,
                                <div key="guideline-link" className="mt-1">
                                    <Link to={urls.home.abstractSubmission} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus:underline focus:outline-none">
                                        <ArrowRight className="size-4" />
                                        View full guideline
                                    </Link>
                                </div>,
                            ]}
                        />
                    </div>

                </div>

                <Dialog
                    open={!!activeAbstract}
                    onOpenChange={(open) => !open && setActiveAbstract(null)}
                >
                    {activeAbstract && (
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className='text-xl font-bold tracking-tight'>
                                            Abstract Preview
                                        </DialogTitle>
                                        <DialogDescription className="text-xs mt-0.5">
                                            Review your paper formatting and declarations before submission.
                                        </DialogDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-3.5 border rounded-xl bg-muted/50 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                                            <FileText size={18} className="stroke-2" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-foreground">PDF Compilation Available</p>
                                            <p className="text-[11px] text-muted-foreground">Download to verify layout rules.</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-1.5 h-8 font-medium text-xs shadow-sm shrink-0 w-full sm:w-auto justify-center"
                                        onClick={() => handlePreview(activeAbstract.id, activeAbstract.title)}
                                        disabled={!activeAbstract?.id}
                                    >
                                        <Download size={13} /> Download PDF
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-6 bg-muted p-4 border rounded-lg">
                                <PreviewAbstractDialog id={activeAbstract?.id} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </fieldset>
        </div>
    )
}


export function CreateAbstractDialog() {
    const navigate = useNavigate()

    const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const response = await axiosClient.post<AbstractSchema>('abstracts/submissions/')
            navigate(urls.users.editAbstract.build({ id: response.data.id }))
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    <Plus />
                    New Submission
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="p-3 bg-primary/10 rounded-full mb-2">
                        <Plus className="size-8 text-primary" />
                    </AlertDialogTitle>
                    <AlertDialogTitle className="flex items-center gap-2 text-lg">
                        Create a New Submission
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        This will create a new <b>draft submission</b>, then you can
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
    )
}


export function DeleteAbstractDialog({ id }: { id: string | number }) {
    const { fetchProfile } = useProfiles()
    const { loading, mutate } = useMutation()

    const handleDelete = async () => {
        try {
            await mutate<never>('delete', `/abstracts/submissions/${id}/`)
            await fetchProfile()
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response.data);
                }
            }
        }
    }

    return (
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
                    <AlertDialogAction variant='destructive' onClick={async () => await handleDelete()}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export function PreviewAbstractDialog({ id }: { id: string | number }) {

    const { data: abstract } = useFetch<AbstractSchema>(`/abstracts/submissions/${id}/`)
    const { data: authors } = useFetch<AuthorSchema[]>(`/abstracts/submissions/${id}/authors/`)
    const { data: declarations } = useFetch<AbstractDeclarationValues>(`/abstracts/submissions/${id}/declarations/`)

    return (
        <div className='w-full'>
            <AbstractData abstract={abstract} authors={authors} declarations={declarations} />
        </div>
    )
}


export default ViewAbstracts