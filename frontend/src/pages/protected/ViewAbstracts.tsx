import axiosClient from '@/clients/axiosClient'
import { AbstractData } from '@/components/AbstractData'
import RichTextEditor, { countWordsFromHTML } from '@/components/EnrichedTextArea'
import { InfoAlert } from '@/components/InfoAlert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroupText } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthContext'
import type { PaginatedResponse } from '@/domain/pagination'
import { useFetch } from '@/hooks/use-fetch'
import { cn } from '@/lib/utils'
import { urls } from '@/routes/routes'
import type { AbstractDeclarationValues } from '@/schemas/abstract-declaration-schema'
import { presentationTypes, type AbstractSchema, type AuthorSchema } from '@/schemas/abstracts/abstract-schemas'
import { createAbstractSchema, type CreateAbstractFormValues } from '@/schemas/abstracts/create-abstract-schema'
import { formatDate } from '@/utils/formatDate'
import { renderHTMLString } from '@/utils/tsx_utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { ArrowRight, CircleAlert, Download, Eye, FilePenLine, FileText, Pencil, Plus, Send, Trash2, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { PaginationController } from './notifications/page'

function ViewAbstracts() {
    const { currentUser: user } = useAuth()
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const [activeAbstract, setActiveAbstract] = useState<AbstractSchema | null>()

    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const { data, isLoading } = useQuery<PaginatedResponse<AbstractSchema>>({
        queryKey: ['abstracts', user.id, page, itemsPerPage],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const { data } = await axiosClient.get<PaginatedResponse<AbstractSchema>>('/participants/profiles/submissions', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                }
            })
            return data
        }
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (id: number | string) => {
            await axiosClient.delete(`/abstracts/submissions/${id}/`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstracts', user.id],
            })
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                if (import.meta.env.DEV) {
                    console.log(error.response.data);
                }
            } else {
                if (import.meta.env.DEV) {
                    console.log(error);
                }
            }
        }
    })

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

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='bg-background border-b-2 border-b-border p-8'>
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

                <div className="flex items-center gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-3 border-primary-main/20 text-primary">
                        <FileText className="text-primary-main stroke-2 size-12" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Abstract Submissions
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your submissions
                        </p>
                    </div>
                </div>
            </div>

            <fieldset disabled={isLoading || isPending} className='w-full space-y-5 p-3 md:p-5 xl:p-8'>
                <div className='flex flex-col justify-end items-center gap-3 md:flex-row md:justify-between'>
                    <h2 className='text-2xl font-semibold'>Abstract submission</h2>
                    <Field orientation="horizontal" className="w-fit">
                        <FieldLabel htmlFor="select-rows-per-page">Items per page</FieldLabel>
                        <Select defaultValue="5" onValueChange={(value) => {
                            const limit = Number(value)
                            if (!isNaN(limit)) {
                                setItemsPerPage(limit)
                                setPage(1)
                            }
                        }}>
                            <SelectTrigger className="w-20" id="select-rows-per-page">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                <SelectGroup>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <CreateAbstractDialog />
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-3 items-start'>

                    <div className='md:col-span-2 space-y-4'>
                        {isLoading && (
                            <div>
                                <Spinner />
                            </div>
                        )}

                        {data?.results.map((abstract) => (
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
                                                        <Trash2 className="size-4 text-destructive" />
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
                                                        <AlertDialogAction variant='destructive' onClick={async () => await mutateAsync(abstract.id)}>
                                                            {isPending ? <Spinner /> : <span>Delete</span>}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardAction>
                                </CardHeader>
                                <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-0">
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>Created: {formatDate(abstract.created_at)} | Last update: {formatDate(abstract.last_update)}</p>
                                    </div>

                                    <CardAction className='sm:hidden ml-auto'>
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
                                                        <Trash2 className="size-4 text-destructive" />
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
                                                        <AlertDialogAction variant='destructive' onClick={async () => await mutateAsync(abstract.id)}>
                                                            {isPending ? <Spinner /> : <span>Delete</span>}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardAction>
                                </CardFooter>
                            </Card>
                        ))}


                        <div>
                            {!isLoading && (
                                <PaginationController
                                    page={page}
                                    onPageChange={setPage}
                                    totalPages={data.meta.total_pages}
                                />
                            )}
                        </div>
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
    const { currentUser: user } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { control, handleSubmit, reset } = useForm<CreateAbstractFormValues>({
        resolver: zodResolver(createAbstractSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
        }
    })

    const { mutateAsync: createAbstractAsync, isPending } = useMutation({
        mutationFn: async (data: CreateAbstractFormValues) => {
            const { data: responseData } = await axiosClient.post<AbstractSchema>('abstracts/submissions/', data)
            return responseData
        },
        onError: error => {
            if (import.meta.env.DEV) {
                isAxiosError(error) ?
                    console.log(error.response.data) :
                    console.log(error);
            }
        },
        onSuccess: (data) => {
            navigate(urls.users.editAbstract.build({ id: data.id }))
            queryClient.invalidateQueries({
                queryKey: ['abstracts', user.id],
            })
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button onClick={() => reset()} disabled={isPending}>
                    <Plus />
                    New Submission
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="-ml-8 md:ml-0 text-center p-3 flex size-12 md:size-14 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-3 border-primary-main/20 text-primary">
                            <FilePenLine className="text-primary-main stroke-2 size-10 md:size-12 shrink-0" />
                        </div>

                        <div className='text-left'>
                            <AlertDialogTitle className="text-xl md:text-2xl font-semibold">
                                Abstract Submissions
                            </AlertDialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Add a title and create it
                            </p>
                        </div>
                    </div>
                </AlertDialogHeader>

                <Separator />

                <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    This will create a new <b>draft submission</b>, then you can
                    enter your abstract, authors, and additional information before submitting it.
                </AlertDialogDescription>

                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='w-full'>
                            <FieldLabel htmlFor={field.name}>Abstract title</FieldLabel>
                            <FieldDescription>
                                Submission title (maximum 10 words).
                            </FieldDescription>
                            <RichTextEditor
                                {...field}
                                title='Abstract title'
                                invalid={fieldState.invalid}
                                id={field.name}
                                multiline={false}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                disabled={isPending}
                                className="wrap-anywhere text-lg"
                                maxLength={3500}
                                footer={
                                    <InputGroupText className={'ml-auto'}>
                                        <FieldLabel htmlFor={field.name} className={cn(
                                            'text-xs',
                                            (fieldState.invalid || countWordsFromHTML(field.value || "") > 10) && 'text-destructive'
                                        )}>
                                            {countWordsFromHTML(field.value || "")}/10 words
                                        </FieldLabel>
                                    </InputGroupText>
                                }
                            />
                            <div className={cn(
                                "overflow-hidden transition-all h-6 duration-200 ease-in-out",
                                fieldState.invalid ? " opacity-100" : " opacity-0"
                            )}>
                                <FieldError errors={[fieldState.error]} />
                            </div>
                            {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
                        </Field>
                    )}
                />

                <Separator />

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} type='button' onClick={handleSubmit(async (v) => await createAbstractAsync(v))}>
                        Continue
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