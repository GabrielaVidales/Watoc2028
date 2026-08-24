import { PaginationController, SelectItemsPerPage } from '@/components/custom/pagination-controller'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthContext'
import { ConfirmProvider, useConfirm } from '@/contexts/ConfirmationDialogContext'
import type { PaginatedResponse } from '@/domain/pagination'
import { CreateAbstractDialog } from '@/forms/submissions/abstract-create-dialog'
import { DEBUG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import DownloadAbstractPDFButton from '@/pages/test/test-abstract-feature'
import { routes } from '@/routes/routes'
import { presentationTypes, type AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { deleteSubmission, getParticipantSubmissions } from '@/services/submissions/submission-services'
import { formatDate } from '@/utils/formatDate'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CircleAlert, Eye, FileCodeIcon, FilePenIcon, FileText, InfoIcon, MoreVertical, Pencil, Search, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDebounce } from 'use-debounce'
import AbstractPreviewData from '../edit/abstract-preview-data'
import DeadlinesCard from './deadlines-card'


function AbstractSubmissionPage() {
    const { user: user } = useAuth()

    const [activeAbstract, setActiveAbstract] = useState<AbstractSchema | null>()

    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [search, setSearch] = useState('')
    const [query] = useDebounce(search, 250)
    const { data, isLoading } = useQuery<PaginatedResponse<AbstractSchema>>({
        queryKey: ['abstracts', user.id, page, itemsPerPage, query],
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        queryFn: () => getParticipantSubmissions({ page, itemsPerPage, search: query })
    })

    return (
        <article className='w-full h-full flex flex-col'>
            <header className='max-w-6xl mx-auto w-full space-y-4 p-8'>
                <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                    <div className="flex items-start gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                            <FileText className="text-primary-main stroke-2 size-9" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-wide">
                                Abstract Submissions
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                View and manage your submissions for WATOC 2028
                            </p>
                        </div>
                    </div>

                    <CreateAbstractDialog />
                </div>
            </header>

            <fieldset disabled={isLoading} className="max-w-6xl mx-auto w-full grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] p-8">
                <div>
                    <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-3">
                            <InputGroup className="w-80">
                                <InputGroupInput
                                    placeholder="Search abstracts..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <Search className="size-4" />
                                </InputGroupAddon>
                                <InputGroupAddon align="inline-end" className='text-xs'>
                                    {data?.meta.total_items ?? 0} abstracts
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="flex items-center gap-4">
                            <SelectItemsPerPage
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                            />
                        </div>
                    </div>

                    <section className='py-4 space-y-4'>
                        {isLoading && (
                            <div>
                                <Spinner />
                            </div>
                        )}

                        <ConfirmProvider>
                            {data?.results.map((abstract) => (
                                <AbstractItem
                                    key={abstract.id}
                                    abstract={abstract}
                                    onAbstractSelected={setActiveAbstract}
                                />
                            ))}
                        </ConfirmProvider>
                    </section>

                    <div className='p-3 md:p-5 xl:p-8 space-y-3'>
                        {!isLoading && (
                            <PaginationController
                                page={page}
                                onPageChange={setPage}
                                totalPages={data.meta.total_pages}
                            />
                        )}
                    </div>
                </div>

                <div>
                    <DeadlinesCard />
                </div>
            </fieldset>

            <AbstractPreviewSheet
                abstract={activeAbstract}
                setAbstract={setActiveAbstract}
            />
        </article>
    )
}

export default AbstractSubmissionPage



type AbstractItemProps = {
    disabled?: boolean
    abstract: AbstractSchema
    onAbstractSelected: (a: AbstractSchema) => void
}

export function AbstractItem({
    abstract,
    onAbstractSelected,
}: AbstractItemProps) {
    const { user: user } = useAuth()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const confirm = useConfirm()


    const { mutateAsync } = useMutation<void, AxiosError, number | string>({
        mutationKey: ['delete-submission'],
        mutationFn: deleteSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstracts', user.id],
                exact: false,
            })
        },
        onError: (error) => {
            DEBUG && console.log(error.response.data);
        }
    })

    const handleDelete = async () => {
        await confirm({
            title: 'Delete Abstract?',
            description: 'This action cannot be undone. The abstract will be permanently deleted.',
            onConfirm: async () => await mutateAsync(abstract.id)
        })
    }


    return (
        <Card key={abstract.id} className="p-4 group outline-2 outline-transparent hover:shadow-md hover:outline-primary-light transition-all duration-300">
            <CardHeader className="flex flex-row items-start gap-3 px-0">
                <CardAction>
                    <div className={cn(
                        "p-1 flex flex-col size-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 border-2 border-amber-400 text-primary",
                        "transition-all duration-400 group-hover:-translate-y-1 group-hover:shadow-md"
                    )}>
                        <FilePenIcon className="text-amber-400 size-6 shrink-0" />
                        {/* <p className='text-amber-400 mx-auto text-center font-semibold text-[11px]'>
                            Not submitted
                        </p> */}
                    </div>
                </CardAction>
                <div className='space-y-2 min-w-0'>
                    <CardTitle className="text-base sm:text-lg font-semibold leading-tight min-w-0">
                        {abstract.title ? (
                            <div
                                onClick={() => onAbstractSelected(abstract)}
                                title={abstract.plain_title}
                                className="cursor-pointer hover:underline truncate"
                                dangerouslySetInnerHTML={{ __html: abstract.title }}
                            />
                        ) : (
                            <span className="flex items-center gap-2 text-destructive">
                                <CircleAlert className="shrink-0 size-5" />
                                Undefined title
                            </span>
                        )}
                    </CardTitle>

                    <CardDescription className="text-sm flex gap-1 items-center">
                        {abstract.is_for_young_watoc ? (
                            <Badge variant="outline">
                                <span className="flex items-center gap-1">
                                    Young WATOC
                                </span>
                            </Badge>
                        ) : (
                            <Badge variant="outline">
                                {presentationTypes?.find((p) => p.value === abstract.presentation_type)?.label || (
                                    <span className="flex items-center gap-1 text-destructive">
                                        <CircleAlert className="size-3.5 shrink-0" />
                                        Presentation type not set
                                    </span>
                                )}
                            </Badge>
                        )}
                    </CardDescription>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                            Created: {formatDate(abstract.created_at)} | Last update: {formatDate(abstract.last_update)}
                        </p>
                    </div>
                </div>
                <CardAction className='ml-auto'>
                    <div className="flex items-center ml-auto gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreVertical className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onAbstractSelected(abstract)}>
                                    <Eye className="mr-2 size-4" />
                                    Preview
                                </DropdownMenuItem>

                                {abstract.status !== "submitted" && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate(routes.users.submissions.edit.build({
                                                    id: abstract.id,
                                                }))
                                            }}
                                        >
                                            <Pencil className="mr-2 size-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate(routes.users.submissions.edit.build({
                                                    id: abstract.id,
                                                }) + "?action=submit")
                                            }}
                                        >
                                            <Send className="mr-2 size-4" />
                                            Submit
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem variant='destructive' onClick={handleDelete}>
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardAction>
            </CardHeader>
        </Card>
    )
}


type AbstractPreviewProps = {
    abstract: AbstractSchema
    setAbstract: (a: AbstractSchema) => void
}

export function AbstractPreviewDialog({ abstract, setAbstract: setActiveAbstract }: AbstractPreviewProps) {

    return (
        <Dialog
            open={!!abstract}
            onOpenChange={(open) => !open && setActiveAbstract(null)}
        >
            {abstract && (
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <CardTitle className="flex gap-3 items-center">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                <FileText className="text-primary-main stroke-2 size-8" />
                            </div>
                            <div>
                                <DialogTitle className='text-xl font-semibold tracking-tight'>
                                    Abstract Preview
                                </DialogTitle>
                                <DialogDescription className="text-xs mt-0.5 font-normal">
                                    Review your paper formatting and declarations before submission.
                                </DialogDescription>
                            </div>
                        </CardTitle>
                    </DialogHeader>

                    <Separator />

                    {/* <DownloadAbstractPDFButton abstractId={abstract.id} /> */}
                    <div className="no-scrollbar h-[50vh]">
                        <ScrollArea className="h-full pr-2">
                            <AbstractPreviewData abstract={abstract} />
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    )
}

export function AbstractPreviewSheet({
    abstract,
    setAbstract: setActiveAbstract,
}: AbstractPreviewProps) {
    return (
        <Sheet
            open={!!abstract}
            onOpenChange={(open) => {
                if (!open) {
                    setActiveAbstract(null);
                }
            }}
        >
            <SheetContent className="w-full sm:max-w-2xl">
                <SheetHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 border-primary-main/20 bg-primary-light/10 text-primary">
                            <InfoIcon className="size-8 stroke-2 text-primary-main" />
                        </div>

                        <div>
                            <SheetTitle className="text-xl font-semibold tracking-tight">
                                Submission Information
                            </SheetTitle>

                            <SheetDescription className="mt-0.5 text-xs font-normal">
                                Review your paper formatting and declarations before submission.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Separator />

                {abstract && (
                    <div className="min-h-0 flex-1 px-4 pr-2 md:px-8 md:pr-4">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4 mb-4">
                                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-main">
                                    <FileCodeIcon className="size-4" />
                                    <span>Submission Metadata</span>
                                </div>

                                <div className="rounded-lg border bg-muted/30 space-y-3 p-4">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Title</p>
                                        <p className="mt-1 text-sm font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: abstract.title || "Not set" }} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Presentation
                                            </p>
                                            {abstract.is_for_young_watoc ? (
                                                <Badge variant="secondary">
                                                    Young WATOC
                                                </Badge>
                                            ) : (
                                                <p className="mt-1 text-sm">
                                                    {abstract.presentation_type || "Not set"}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Status
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {abstract.status || "Not set"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Created
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {abstract.created_at
                                                    ? formatDate(new Date(abstract.created_at))
                                                    : "Not set"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Last update
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {abstract.last_update
                                                    ? formatDate(new Date(abstract.last_update))
                                                    : "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <DownloadAbstractPDFButton abstractId={abstract.id} />
                            </div>
                            <AbstractPreviewData abstract={abstract} />
                        </ScrollArea>
                    </div>
                )}

                <SheetFooter>
                    <Button
                        variant="outline"
                        onClick={() => setActiveAbstract(null)}
                    >
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
