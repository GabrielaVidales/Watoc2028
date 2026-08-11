import React, { useEffect, useState } from 'react'
import TestAbstractFeature from './test-abstract-feature'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Trash2, TriangleAlertIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import type { PaginatedResponse } from '@/domain/pagination'
import api from '@/clients/api'
import { Item, ItemActions, ItemContent, ItemMedia, } from "@/components/ui/item"
import AbstractContentForm from '@/forms/submissions/edit-abstract-body'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaginationController } from '@/components/custom/pagination-controller'
import ShowAuthorsComponent from '@/components/ShowAuthors'
import { Separator } from '@/components/ui/separator'
import { CreateAbstractDialog } from '@/forms/submissions/abstract-create-dialog'
import type { AxiosError } from 'axios'
import { deleteSubmission } from '@/services/submissions/submission-services'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { DEBUG } from '@/lib/constants'
import { formatDate } from '@/utils/formatDate'
import ShowAffiliations from '@/components/ShowAffiliations'
import { InfoAlert } from '@/components/InfoAlert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function TestAbstractFeaturePage() {
    const { user, handleLogin, } = useAuth()

    useEffect(() => {
        const authenticate = async () => {
            if (user === undefined) {
                console.log('CARGANDO...');
            }
            else if (user === null) {
                console.log('NO LOGGEADO...');
                await handleLogin('test@mail.com', 'password')
            } else {
                console.log('LOG IN');
            }
        }
        authenticate()
    }, [user])

    const [selectedAbstract, setSelectedAbstract] = useState<number>(null)
    const { data = null } = useQuery<AbstractSchema>({
        queryKey: ['abstract', selectedAbstract],
        queryFn: async () => {
            const { data } = await api.get<AbstractSchema>(`/abstracts/submissions/${selectedAbstract}/`)
            return data
        }
    })


    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const { data: results } = useQuery<PaginatedResponse<AbstractSchema>>({
        queryKey: ['abstract', page, itemsPerPage],
        queryFn: async () => {
            const { data } = await api.get('/participants/profiles/submissions/', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                }
            })
            return data
        },
    })

    const onAbstractSelected = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, abstract: AbstractSchema) => {
        e.preventDefault()
        setSelectedAbstract(prev => prev === abstract.id ? null : abstract.id)
    }

    const queryClient = useQueryClient()

    const deleteMut = useMutation<void, AxiosError, number | string>({
        mutationFn: deleteSubmission,
        onSuccess: () => {
            setSelectedAbstract(null)
            queryClient.invalidateQueries({
                queryKey: ['abstract', page, itemsPerPage],
            })
        },
        onError: (error) => {
            if (DEBUG) {
                console.log(error.response.data);
            }
        }
    })

    return (
        <div className='bg-indigo-100 dark:bg-secondary min-h-dvh h-full md:h-screen'>
            <div className='w-full mx-auto min-h-dvh md:h-full'>
                <section className='grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] min-h-dvh md:h-full md:overflow-hidden'>

                    <ScrollArea className='order-2 md:order-1 min-w-0 shrink space-y-6 w-full no-scrollbar md:overflow-y-hidden max-md:border-t'>
                        <div className='max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:py-10'>
                            <Card className='w-full p-5 sm:p-9'>
                                <CardHeader className='px-0'>
                                    <CardTitle className="flex gap-3 items-center">
                                        <FileText className='text-primary-main' />
                                        <h2 className='text-xl font-semibold'>Abstract Content</h2>
                                    </CardTitle>
                                    <CardDescription>
                                        Complete the details (full name, email, affiliation and country) of collaboration authors. You can include a maximum of 16 authors. Please indicate which of the authors will present the abstract.
                                    </CardDescription>
                                </CardHeader>

                                <InfoAlert
                                    title='Submission Guidelines'
                                    messages={[
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="guidelines" className="w-full">
                                                <AccordionTrigger className="w-full flex-1 p-1">
                                                    Please review the following requirements before completing your submission.
                                                </AccordionTrigger>

                                                <AccordionContent>
                                                    <ul className="list-disc space-y-2 pl-4 pr-6 opacity-80">
                                                        <li>
                                                            <strong>Authors:</strong> Provide the full name, email, affiliation, and country
                                                            for each collaboration author. You may include a maximum of <strong>16 authors</strong>.
                                                            Please indicate which author will present the abstract.
                                                        </li>
                                                        <li>
                                                            <strong>Title:</strong> Use a concise and descriptive title of no more than <strong>20 words</strong>.
                                                            Do not include author names, affiliations, institutions, or other identifying information.
                                                        </li>
                                                        <li>
                                                            <strong>Presentation type:</strong> Select your preferred format for presenting your work.
                                                        </li>
                                                        <li>
                                                            <strong>Abstract:</strong> The abstract must be written in <strong>English</strong> and contain no more than <strong>300 words</strong>.
                                                            Do not include information that identifies the presenters
                                                            or their institutions, as abstracts will be reviewed anonymously.
                                                        </li>
                                                        <li>
                                                            <strong>References:</strong> References are required and must not exceed <strong>150 words</strong>.
                                                        </li>
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ]}
                                />

                                <Separator />

                                <CardContent className="space-y-6 px-0">
                                    <AbstractContentForm abstractId={selectedAbstract} />
                                </CardContent>

                                {selectedAbstract && (
                                    <>
                                        <Separator />

                                        <CardContent className="space-y-6 px-0">
                                            <ShowAuthorsComponent abstractId={selectedAbstract} />
                                        </CardContent>
                                    </>
                                )}

                                {selectedAbstract && (
                                    <>
                                        <Separator />

                                        <CardContent className="space-y-2 px-0">
                                            <ShowAffiliations abstractId={selectedAbstract} />
                                        </CardContent>
                                    </>
                                )}
                            </Card>
                        </div>
                    </ScrollArea>

                    <ScrollArea className='order-1 md:order-2 min-w-0 w-full no-scrollbar bg-background border-t md:border-t-0 md:border-l md:overflow-y-auto'>
                        <header className="md:sticky md:top-0 z-10 min-h-9 px-4 py-1.5 md:py-0 bg-blue-800 border-b border-blue-600 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground select-none">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white/80 tracking-tight">System Status</span>
                            </div>

                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-white/80">
                                    Current user:
                                </span>

                                {user ? (
                                    <div className="flex min-w-0 items-center gap-2 bg-background/80 border border-border/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                                        <span className="relative flex size-2 shrink-0">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                                        </span>
                                        <span className="font-medium text-foreground truncate max-w-36">
                                            {user.full_name}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive px-2 py-0.5 rounded-md font-medium">
                                        <span className="size-1.5 rounded-full bg-destructive"></span>
                                        <span>Not logged in</span>
                                    </div>
                                )}
                            </div>
                        </header>

                        <div className='p-2 sm:p-4 min-w-0 w-dvw md:w-100'>
                            <Card>
                                <CardContent>
                                    <h3 className='font-medium text-muted-foreground'>Selected abstract:</h3>
                                    {data ? (
                                        <>
                                            <h4 className='leading-tight truncate' dangerouslySetInnerHTML={{ __html: data.title }}></h4>
                                            <p className='text-xs text-muted-foreground mt-2'>Last modification: {formatDate(data.last_update)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className='leading-tight truncate text-destructive'>No abstract selected</h4>
                                            <p className='text-xs text-muted-foreground mt-2'>Last modification: <span className='text-destructive'>No abstract selected</span></p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="list" className='p-2 sm:p-4 min-w-0 w-dvw md:w-100 mb-10'>
                            <TabsList>
                                <TabsTrigger value="list">Submission List</TabsTrigger>
                                <TabsTrigger value="download">Generate PDF</TabsTrigger>
                            </TabsList>
                            <TabsContent value="list" className='space-y-4'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your submissions</CardTitle>
                                        <CardDescription>
                                            Create a submission or select a submission from the list below to edit your abstract.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className='space-y-4'>
                                        <CreateAbstractDialog redirect={false} size='sm' className='w-full' />

                                        <div className='bg-muted flex-1 space-y-1 p-1 rounded-sm border'>
                                            {results?.results?.map((abstract) => (
                                                <Item key={abstract.id} variant="outline" size="sm" className='bg-card'>
                                                    <ItemMedia>
                                                        <Button type='button' variant='outline' size='icon-lg' onClick={(e) => onAbstractSelected(e, abstract)}
                                                            className={cn(
                                                                'shrink-0',
                                                                abstract.id === data?.id && 'border-primary-light bg-primary-light/20 hover:bg-primary-light/10 text-primary-light hover:text-primary-light'
                                                            )}
                                                        >
                                                            <FileText className='size-5' />
                                                        </Button>
                                                    </ItemMedia>
                                                    <ItemContent className='min-w-0 w-0 flex-1'>
                                                        <div className="min-w-0 w-full">
                                                            <p className="w-full min-w-0 truncate" dangerouslySetInnerHTML={{ __html: abstract.title }}></p>
                                                            <p className='truncate text-muted-foreground text-xs'>{abstract.presentation_type.toUpperCase()}</p>
                                                        </div>
                                                    </ItemContent>
                                                    <ItemActions className='shrink-0'>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button type='button' variant='outline' size='icon-sm' className='border-destructive hover:bg-destructive/10'>
                                                                    <Trash2 className='text-destructive' />
                                                                </Button>
                                                            </AlertDialogTrigger>

                                                            <AlertDialogContent size="sm">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="mb-2 rounded-full bg-destructive/10 p-3">
                                                                        <TriangleAlertIcon className="size-8 text-destructive" />
                                                                    </AlertDialogTitle>

                                                                    <AlertDialogTitle>
                                                                        Delete Abstract?
                                                                    </AlertDialogTitle>

                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. The abstract will be permanently deleted.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>

                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>

                                                                    <AlertDialogAction
                                                                        variant="destructive"
                                                                        onClick={() => deleteMut.mutateAsync(abstract.id)}
                                                                    >
                                                                        {deleteMut.isPending ? <Spinner /> : "Delete"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </ItemActions>
                                                </Item>
                                            ))}
                                        </div>

                                        <div className='mt-auto'>
                                            <PaginationController
                                                onPageChange={setPage}
                                                page={page}
                                                totalPages={results ? results.meta.total_pages : 0}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="download">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Download Submission Preview</CardTitle>
                                        <CardDescription>
                                            Generate and download a PDF preview of your submission.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className='space-y-4'>
                                        <TestAbstractFeature abstractId={data ? data.id : null} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>

                </section>
            </div>

            <div className='fixed bottom-0 w-full bg-primary/80 dark:bg-white/20 left-0 z-50 p-1 pointer-events-none flex items-center justify-center'>
                <p className='text-accent text-xs font-medium dark:text-destructive'>DEV environment</p>
            </div>
        </div>
    )
}

export default TestAbstractFeaturePage
