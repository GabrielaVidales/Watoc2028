import React, { useEffect, useState } from 'react'
import TestAbstractFeature from './test-abstract-feature'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserSchema } from '@/schemas/user-schemas'
import { Delete, FileText, Plus, Trash2, TriangleAlertIcon } from 'lucide-react'
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

    const [selectedAbstract, setSelectedAbstract] = useState<AbstractSchema>(null)

    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const { data: results } = useQuery<PaginatedResponse<AbstractSchema>>({
        queryKey: ['abstracts', page, itemsPerPage],
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
        setSelectedAbstract(prev => prev?.id === abstract.id ? null : abstract)
    }

    const queryClient = useQueryClient()

    const deleteMut = useMutation<void, AxiosError, number | string>({
        mutationFn: deleteSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['abstracts', page, itemsPerPage],
            })
        },
        onError: (error) => {
            if (DEBUG) {
                console.log(error.response.data);
            }
        }
    })

    return (
        <div className='bg-slate-50 relative min-h-dvh lg:h-screen'>
            <div className='w-full mx-auto min-h-dvh lg:h-full'>
                {/* 1 columna en mobile → 2 columnas fijas en desktop */}
                <section className='grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-dvh lg:h-full lg:overflow-hidden'>

                    {/* ── Columna principal ───────────────────────────────── */}
                    <ScrollArea className='min-w-0 space-y-6 p-4 sm:p-6 w-full no-scrollbar lg:overflow-y-auto'>
                        <div className='max-w-4xl mx-auto space-y-6'>
                            <h2 className='text-xl sm:text-2xl font-medium'>New Submission</h2>

                            <Card className='w-full p-5 sm:p-9'>

                                <CardContent className="space-y-6 px-0">
                                    <AbstractContentForm abstractId={selectedAbstract?.id} />
                                </CardContent>

                                <Separator />

                                <CardContent className="space-y-6 px-0">
                                    <ShowAuthorsComponent abstractId={selectedAbstract?.id} />
                                </CardContent>
                            </Card>
                        </div>
                    </ScrollArea>

                    {/* ── Panel lateral ───────────────────────────────────── */}
                    <ScrollArea className='min-w-0 w-full no-scrollbar bg-background border-t lg:border-t-0 lg:border-l lg:overflow-y-auto'>
                        <header className="lg:sticky lg:top-0 z-10 min-h-9 px-4 py-1.5 lg:py-0 bg-primary-light/50 border-b border-border/60 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground select-none">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground/80 tracking-tight">System Status</span>
                            </div>

                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-foreground/80">
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

                        {/* w-full en mobile, ancho fijo 400px (w-100) en desktop */}
                        <div className='space-y-6 p-4 sm:p-6 w-full lg:w-100'>
                            <CardHeader className='px-0'>
                                <CardTitle>Download Submission Preview</CardTitle>
                                <CardDescription>
                                    Generate and download a PDF preview of your submission.
                                </CardDescription>
                            </CardHeader>

                            <TestAbstractFeature abstractId={selectedAbstract ? selectedAbstract.id : null} />

                            <CardHeader className='px-0'>
                                <CardTitle>Your submissions</CardTitle>
                                <CardDescription>
                                    Generate and download a PDF preview of your submission.
                                </CardDescription>
                            </CardHeader>

                            <section className='flex flex-col gap-2 min-h-60'>

                                <CreateAbstractDialog redirect={false} size='xs' />

                                <div className='bg-muted flex-1 space-y-1 p-1 rounded-sm border'>

                                    {results?.results?.map((abstract) => (
                                        <Item key={abstract.id} variant="outline" size="sm" asChild>
                                            <a href='#' className='bg-card'>
                                                <ItemMedia>
                                                    <Button type='button' variant='outline' size='icon-lg' onClick={(e) => onAbstractSelected(e, abstract)}
                                                        className={cn(
                                                            'shrink-0',
                                                            abstract.id === selectedAbstract?.id && 'border-primary-light bg-primary-light/20 hover:bg-primary-light/10 text-primary-light hover:text-primary-light'
                                                        )}
                                                    >
                                                        <FileText className='size-5' />
                                                    </Button>
                                                </ItemMedia>
                                                <ItemContent className='min-w-0'>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="truncate">{abstract.title}</p>
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
                                            </a>
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
                            </section>
                        </div>
                    </ScrollArea>
                </section>
            </div>

            <div className='absolute bottom-0 left-0 z-50 px-2 pb-1 pointer-events-none'>
                <p className='text-destructive text-xs sm:text-sm'>DEV environment</p>
            </div>
        </div>
    )
}

export default TestAbstractFeaturePage
