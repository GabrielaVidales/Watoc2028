import React, { useEffect, useRef, useState } from 'react'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import BeforeSubmitPage from './BeforeSubmitPage'
import EditAbstractBody from '@/forms/wrappers/EditAbstractBody'
import { Link, useNavigate, useParams } from 'react-router'
import { urls } from '@/routes/routes'
import { Button } from '@/components/ui/button'
import { Gavel, MessageSquareCode, TextQuote, UserPlus } from 'lucide-react'
import type { AbstractSchema } from '@/schemas/abstract-schemas'
import { Spinner } from '@/components/ui/spinner'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTitle, StepperTrigger, } from "@/components/reui/stepper"
import { CheckIcon, LoaderCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/clients/axiosClient'
import { cn, } from '@/lib/utils'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { Separator } from '@/components/ui/separator'
import ShowAuthorsComponent from '@/components/ShowAuthors'
import ShowAffiliations from '@/components/ShowAffiliations'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"


function EditAbstractPage() {
    const navigate = useNavigate()
    const parentRef = useRef<HTMLDivElement | null>(null)

    const { id } = useParams()
    const { data } = useQuery<AbstractSchema>({
        queryKey: ['abstract', 'edit'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000))
            const { data } = await axiosClient.get(`/abstracts/submissions/${id}/`)
            return data
        }
    })

    useEffect(() => {
        if (data?.status === 'submitted') {
            navigate(urls.users.viewAbstracts)
        }
    }, [data])

    const [currStep, setCurrState] = useState(1)
    const nextStep = () => {
        console.log('Puta madre');

        if (currStep < 4) {
            setCurrState(prev => prev + 1)
        }
    }
    const previousStep = () => {
        console.log('Puta madre');

        if (currStep > 1) {
            setCurrState(prev => prev - 1)
        }
    }

    const steps = [
        {
            id: 'abstract-content',
            title: 'Content',
            label: 'Enter your abstract title, body, and references.',
        },
        {
            id: 'abstract-authors',
            title: 'Authors',
            label: 'Add authors and their affiliations.',
        },
        {
            id: 'abstract-declarations',
            title: 'Declarations',
            label: 'Review and accept the required declarations.',
        },
        {
            id: 'abstract-review',
            title: 'Review',
            label: 'Review your submission and submit your abstract.',
        },
    ]

    const activeId = useScrollSpy(steps.map(s => s.id));

    useEffect(() => {
        const getActiveId = steps.findIndex(i => i.id === activeId) + 1
        setCurrState(getActiveId)
    }, [activeId])

    if (!data) {
        return (
            <Spinner />
        )
    }

    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[1fr_340px] items-start">
            <main id='main-container' className='bg-primary-main/20 relative h-full w-full overflow-y-auto no-scrollbar p-8 space-y-5' ref={parentRef}>
                <Card className='max-w-4xl w-full mx-auto'>
                    <CardHeader>
                        <Breadcrumb>
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
                                    <BreadcrumbLink asChild>
                                        <Link to={urls.users.viewAbstracts}>
                                            Abstract Submissions
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <CardTitle className='text-2xl'>
                            Edit Abstract Submission
                        </CardTitle>
                        <CardDescription>
                            asdsadsa
                        </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardContent>
                        <div id='abstract-content' />
                        <div className="flex gap-3 items-center">
                            <TextQuote className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Abstract Content</h2>
                        </div>

                        <EditAbstractBody />
                    </CardContent>
                </Card>

                <Separator />

                <Card className='max-w-4xl w-full mx-auto'>
                    <CardContent>
                        <div id='abstract-authors' />
                        <div className="flex gap-3 items-center">
                            <UserPlus className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Authors List</h2>
                        </div>

                        <ShowAuthorsComponent />

                        <Accordion
                            type="single"
                            collapsible
                            className="rounded-lg border"
                        >
                            <AccordionItem value={'puta-madre'} className={cn(
                                "border-b px-4 last:border-b-2",
                                "group relative cursor-pointer border-2 border-border rounded-md transition-colors duration-300",
                                "hover:border-primary-light hover:shadow-sm",
                            )}>
                                <AccordionTrigger className="cursor-pointer text-base focus-visible:outline-none focus-visible:ring-0">
                                    Manage affiliations
                                </AccordionTrigger>
                                <AccordionContent>

                                    <ShowAffiliations />

                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </CardContent>
                </Card>

                <Separator />

                <Card className='max-w-4xl w-full mx-auto'>
                    <CardContent>
                        <div id='abstract-declarations' />
                        <div className="flex gap-3 items-center">
                            <Gavel className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Authors Declarations</h2>
                        </div>

                        <AbstractDeclarations />
                    </CardContent>
                </Card>

                <Separator />

                <Card className='max-w-4xl w-full mx-auto'>
                    <CardContent>
                        <div id='abstract-review' />
                        <div className="flex gap-3 items-center">
                            <MessageSquareCode className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Submission Review</h2>
                        </div>

                        <BeforeSubmitPage />
                    </CardContent>

                </Card>
            </main>

            <aside className="flex-1 h-full w-full border-l bg-background">
                <div className="sticky top-0 py-8">
                    <CardHeader>
                        <CardTitle className=''>
                            Status
                        </CardTitle>
                        <CardDescription>
                            Your submission status
                        </CardDescription>
                        <CardAction>
                            <Badge>
                                {data.status.toUpperCase()}
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Stepper
                            onValueChange={v => {
                                const id = steps[v - 1].id
                                const element = document.getElementById(id)
                                if (element && parentRef.current) {
                                    const parent = parentRef.current;

                                    // Calculamos la posición del elemento relativa al contenedor main
                                    const targetOffsetTop = element.offsetTop;

                                    // Restamos unos 16-20px si quieres dejar un pequeño margen de cortesía arriba
                                    parent.scrollTo({
                                        top: targetOffsetTop,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            value={currStep}
                            defaultValue={2}
                            className="h-full w-full py-6"
                            orientation="vertical"
                            indicators={{
                                completed: (
                                    <CheckIcon className="size-3.5" />
                                ),
                                loading: (
                                    <LoaderCircleIcon className="size-3.5 animate-spin" />
                                ),
                            }}
                        >
                            <StepperNav>
                                {steps.map((step, index) => (
                                    <StepperItem
                                        key={index}
                                        step={index + 1}
                                        className="relative items-start not-last:flex-1"
                                    >
                                        <StepperTrigger className="items-start gap-2.5 pb-14 last:pb-0">
                                            <StepperIndicator>
                                                {index + 1}
                                            </StepperIndicator>
                                            <div className="mt-0.5 text-left">
                                                <StepperTitle className='text-sm'>{step.title}</StepperTitle>
                                                <StepperDescription className='text-xs'>{step.label}</StepperDescription>
                                            </div>
                                        </StepperTrigger>
                                        {index < steps.length - 1 && (
                                            <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]" />
                                        )}
                                    </StepperItem>
                                ))}
                            </StepperNav>
                        </Stepper>
                    </CardContent>
                    <CardContent className="text-sm text-muted-foreground">
                        Your abstract is currently in draft. Once you click "Submit", it will move to the <strong>Review Process</strong>.
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={previousStep}>Decline</Button>
                        <Button onClick={nextStep}>Accept</Button>
                    </CardFooter>
                </div>
            </aside>
        </div>
    )
}

export default EditAbstractPage
