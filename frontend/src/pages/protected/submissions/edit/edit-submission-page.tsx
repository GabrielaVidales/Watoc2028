import ShowAffiliations from '@/components/ShowAffiliations'
import ShowAuthorsComponent from '@/components/ShowAuthors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmProvider, useConfirm } from '@/contexts/ConfirmationDialogContext'
import AbstractContentForm from '@/forms/submissions/abstract-content-form'
import { DEBUG } from '@/lib/constants'
import { cn, } from '@/lib/utils'
import { routes } from '@/routes/routes'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { getSubmissionById, submitAbstract } from '@/services/submissions/submission-services'
import { formatDate } from '@/utils/formatDate'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { LucideFileEdit, RotateCw, ScanText, SendIcon } from 'lucide-react'
import { Navigate, useParams } from 'react-router'
import DeadlinesCard from '../summary/deadlines-card'


function EditAbstractPage() {
    const { id } = useParams()
    const { data } = useQuery<AbstractSchema>({
        queryKey: ['abstract', 'edit'],
        queryFn: () => getSubmissionById(id),
        enabled: !!id
    })

    if (!data) {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <div className={cn(
                    'flex flex-col justify-center items-center gap-2 p-4',
                    'bg-muted border-3 border-dashed border-muted-foreground/20',
                    'text-muted-foreground/60 rounded-md '
                )}>
                    <p className='font-medium tracking-wider'>Loading data from server...</p>
                    <RotateCw className='size-8 animate-spin' />
                </div>
            </div>
        )
    }

    if (data.status === 'submitted') {
        return <Navigate to={routes.users.submissions.summary} />
    }

    return (
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_350px]">
            <main id='main-container' className="w-full py-8">
                <div className='bg-background space-y-4 mb-4'>
                    <div className='flex flex-row md:justify-between gap-5'>
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                <LucideFileEdit className="text-primary-main stroke-2 size-8" />
                            </div>

                            <div className="min-w-0 flex-1 space-y-0">
                                <p className="text-sm text-muted-foreground">
                                    Editting submission
                                </p>
                                <h4 className='text-2xl font-semibold leading-tight truncate' title={data.plain_title} dangerouslySetInnerHTML={{ __html: data.title }}></h4>
                                <p className='text-xs text-muted-foreground mt-2'>Last modification: {formatDate(data.last_update)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cn("w-full space-y-4 md:space-y-8 lg:space-y-12 mb-8",)}>
                    <Card className='w-full gap-0' id='abstract-content'>
                        <CardContent className='space-y-5'>
                            <CardTitle className="flex gap-3 items-center">
                                <ScanText className='text-primary-main' />
                                <h2 className='text-xl font-semibold'>Abstract Content</h2>
                            </CardTitle>

                            <AbstractContentForm abstractId={data ? data.id : null} />
                        </CardContent>
                    </Card>

                    <Card className='w-full gap-0' id='abstract-authors'>

                        <CardContent className='space-y-5'>
                            <ShowAuthorsComponent abstractId={data ? data.id : null} />

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="settings" className="border-b-0">
                                    <AccordionTrigger className="flex items-center justify-between rounded-md bg-muted/40 p-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                        <span>More settings...</span>
                                    </AccordionTrigger>

                                    <AccordionContent className="pt-4 pb-0">
                                        <div className="rounded-md border-2 border-input/30 bg-background/30 p-4">
                                            <ShowAffiliations abstractId={data?.id ?? null} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <aside className='w-full py-8 space-y-4'>
                <DeadlinesCard />

                <ConfirmProvider>
                    <SubmitAbstract abstract={data} />
                </ConfirmProvider>
            </aside>
        </div>
    )
}

export default EditAbstractPage


type Props = {
    abstract: AbstractSchema
}

function SubmitAbstract({ abstract }: Props) {
    const confirm = useConfirm()

    const submitMutation = useMutation<AbstractSchema, AxiosError, number | string>({
        mutationFn: submitAbstract,
        onError: (error) => DEBUG && console.log(error),
        onSuccess: () => {
            console.log('PUTA');
        }
    })

    const handleSubmit = () => {
        if (!abstract?.id) return

        confirm({
            title: 'Submit abstract?',
            description: 'You are going to submit your abstract',
            onConfirm: async () => {
                submitMutation.mutate(abstract.id)
            }
        })

    }

    return (
        <Card>
            <CardHeader className="flex flex-row-reverse items-center justify-start">
                <CardAction className="order-2">
                    <SendIcon className="text-primary-main" />
                </CardAction>

                <CardTitle className="order-1 mr-auto text-lg">
                    Submission Status
                </CardTitle>
            </CardHeader>

            <CardContent>
                {getStatusBadge(abstract.status)}
            </CardContent>

            <CardFooter>
                <Button onClick={handleSubmit}>
                    Submit Abstract
                </Button>
            </CardFooter>
        </Card>
    )
}

function getStatusBadge(status: string) {
    switch (status) {
        case "deleted":
            return <Badge variant="destructive">Deleted</Badge>;
        case "draft":
            return <Badge variant="warning">Not Submitted</Badge>;
        case "submitted":
            return <Badge variant="outline">Submitted / Under Review</Badge>;
        case "accepted":
            return <Badge variant="default">Accepted</Badge>;
        case "rejected":
            return <Badge variant="destructive">Rejected</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
}