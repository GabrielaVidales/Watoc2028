import api from '@/clients/api'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import DocxIcon, { PDFIcon } from '@/components/ui/file-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import type { ReviewAssignment } from '@/domain/reviews'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ChevronDownIcon, FileText, MailOpen, MessageSquareCode, TextQuote, VolumeOffIcon } from 'lucide-react'
import React from 'react'
import { useParams } from 'react-router'
import ReviewForm from '@/forms/ReviewForm'
import { ScrollArea } from '@/components/ui/scroll-area'
import AbstractPreviewData from '../../submissions/edit/abstract-preview-data'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'

function ReviewAbstract() {
    const { id } = useParams()

    const { data: assignment, isLoading } = useQuery({
        queryKey: ['review', id],
        queryFn: async () => {
            const { data } = await api.get<ReviewAssignment>(`/reviews/assignments/${id}/`)
            return data
        }
    })

    const { data: abstract, isLoading: isAbstractLoading } = useQuery<AbstractSchema>({
        queryKey: ['review', 'abstract', assignment?.abstract?.id],
        queryFn: async () => {
            if (!assignment) return null
            const { data } = await api.get<AbstractSchema>(`/abstracts/submissions/${assignment.abstract.id}/`)
            return data
        }
    })


    if (isLoading) {
        return (
            <div>
                <Spinner />
                <span>Loading...</span>
            </div>
        )
    }



    if (isAbstractLoading) {
        return (
            <div>
                <Spinner />
                <span>Fetching data...</span>
            </div>
        )
    }

    console.log(abstract);



    return (
        <div className="lg:sticky lg:top-0 h-full grid grid-cols-1 lg:grid-cols-[1fr_480px]">

            <main id='main-container' className='h-full w-full overflow-y-auto no-scrollbar'>
                <div className='lg:sticky lg:top-0 border-b-2 p-8 z-100 bg-background'>

                    <div>
                        <CardTitle className='text-2xl'>
                            Edit Abstract Submission
                        </CardTitle>
                    </div>
                </div>

                <div className='lg:sticky lg:top-0 border-b-2 p-8'>
                    <AbstractPreviewData abstract={abstract} />
                </div>

            </main>

            <aside className=" w-full border-t lg:border-t-0 lg:border-l-2 bg-card dark:border-l-input">
                <div className="py-6 space-y-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-8 lg:space-y-8">
                    <CardHeader>
                        <div className="flex items-start gap-3 w-full">

                            <div className="flex size-10 mt-2 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                <TextQuote className="shrink-0 text-primary-main stroke-[2.5] size-7" />
                            </div>

                            <div className='min-w-0'>
                                <CardDescription className='text-xs font-medium tracking-wider uppercase'>
                                    Reviewing submission
                                </CardDescription>
                                <CardTitle className='text-xl' dangerouslySetInnerHTML={{ __html: assignment.abstract.title }} />
                            </div>
                        </div>

                        <ButtonGroup className='ml-auto'>
                            <Button variant="outline" size='sm'>
                                <PDFIcon className='size-5' />
                                Download PDF
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size='sm' className="pl-2! border-l-muted">
                                        <ChevronDownIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <DocxIcon className='size-5' />
                                            Download DOCX
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ButtonGroup>
                    </CardHeader>

                    <ScrollArea className='h-100 border-y bg-secondary'>
                        <CardContent className="text-sm text-muted-foreground py-4">
                            <ReviewForm />
                        </CardContent>
                    </ScrollArea>

                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" >Decline</Button>
                        <Button form='review-form'>
                            Accept
                        </Button>
                    </CardFooter>
                </div>
            </aside>
        </div>
    )
}

export default ReviewAbstract