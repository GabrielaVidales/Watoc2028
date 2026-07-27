import api from '@/clients/api'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTitle, StepperTrigger, } from "@/components/reui/stepper"
import ShowAffiliations from '@/components/ShowAffiliations'
import ShowAuthorsComponent from '@/components/ShowAuthors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import EditAbstractBody from '@/forms/wrappers/EditAbstractBody'
import { useIsMobile } from '@/hooks/use-mobile'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn, } from '@/lib/utils'
import { routes } from '@/routes/routes'
import type { AbstractSchema } from '@/schemas/abstracts/abstract-schemas'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon, Gavel, IdCard, LoaderCircleIcon, LucideFileEdit, MailOpen, MessageSquareCode, RotateCw, ScanText, TextQuote, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import BeforeSubmitPage from '../../BeforeSubmitPage'
import { Spinner } from '@/components/ui/spinner'
import { formatDate } from '@/utils/formatDate'
import AbstractContentForm from '@/forms/submissions/abstract-content-form'


function EditAbstractPage() {
    const isMobile = useIsMobile()
    const navigate = useNavigate()
    const parentRef = useRef<HTMLDivElement | null>(null)

    const { id } = useParams()
    const { data } = useQuery<AbstractSchema>({
        queryKey: ['abstract', 'edit'],
        queryFn: async () => {
            const { data } = await api.get(`/abstracts/submissions/${id}/`)
            return data
        }
    })

    useEffect(() => {
        if (data?.status === 'submitted') {
            navigate(routes.users.submissions.summary)
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

    const activeId = useScrollSpy(steps.map(s => s.id), {
        root: parentRef.current,
        rootMargin: '-80px'
    });

    useEffect(() => {
        const getActiveId = steps.findIndex(i => i.id === activeId) + 1
        setCurrState(getActiveId)
    }, [activeId])

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

    return (
        <>
            <div className={cn(
                "h-full grid",
                isMobile ? "grid-cols-1" : "sticky top-0 grid-cols-[1fr_340px]",
            )}>

                <main id='main-container' className='h-full w-full overflow-y-auto no-scrollbar bg-background' ref={parentRef}>

                    <div className='bg-background space-y-4 p-8 pb-4'>
                        <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                            <div className="flex items-start gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                    <LucideFileEdit className="text-primary-main stroke-2 size-8" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-semibold">
                                        Manage Users
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Search, filter and manage registered users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='sticky top-0 z-10 bg-background border-b-2 border-b-border space-y-0 px-8 py-4 tracking-wide'>
                        <h3 className='font-medium'>Editing submission:</h3>
                        <h4 className='text-xl leading-tight truncate' dangerouslySetInnerHTML={{ __html: data.title }}></h4>
                        <p className='text-xs text-muted-foreground mt-2'>Last modification: {formatDate(data.last_update)}</p>
                    </div>

                    <div className={cn("p-2 md:p-4 lg:p-6 bg-secondary space-y-4 md:space-y-8 lg:space-y-12",)}>

                        <Card className='max-w-4xl mx-auto w-full gap-0' id='abstract-content'>
                            <CardContent className='space-y-5 md:py-5 md:px-10'>
                                <CardTitle className="flex gap-3 items-center">
                                    <ScanText className='text-primary-main' />
                                    <h2 className='text-xl font-semibold'>Abstract Content</h2>
                                </CardTitle>

                                <EditAbstractBody />
                            </CardContent>
                        </Card>

                        <Card className='max-w-3xl w-full mx-auto'>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                                        <TextQuote className="text-primary-main stroke-[2.5] size-7" />
                                    </div>

                                    <div>
                                        <CardTitle className='text-xl'>Abstract Content</CardTitle>
                                        <CardDescription className='text-base'>
                                            Enter the title, category and abstract of your submission.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>


                            <CardContent>
                                <div className='bg-muted p-4 border-2 border-muted-foreground/20 border-dashed rounded-lg'>
                                    {/* <EditAbstractBody /> */}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='max-w-3xl w-full mx-auto' id='abstract-authors' >
                            <CardContent>
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

                        <Card className='max-w-3xl w-full mx-auto' id='abstract-declarations'>
                            <CardContent>
                                <div className="flex gap-3 items-center">
                                    <Gavel className='text-primary-main' />
                                    <h2 className='text-xl font-semibold'>Authors Declarations</h2>
                                </div>

                                <AbstractDeclarations />
                            </CardContent>
                        </Card>

                        <Card className='max-w-3xl w-full mx-auto mb-20' id='abstract-review'>
                            <CardContent>
                                <div className="flex gap-3 items-center">
                                    <MessageSquareCode className='text-primary-main' />
                                    <h2 className='text-xl font-semibold'>Submission Review</h2>
                                </div>

                                <BeforeSubmitPage />
                            </CardContent>

                        </Card>
                    </div>
                </main>


                {!isMobile && (
                    <aside className=" w-full border-t lg:border-t-0 lg:border-l bg-background">
                        <div className="py-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-8">
                            <CardHeader>
                                <div>
                                    <CardTitle>
                                        Status
                                    </CardTitle>
                                    <CardDescription>
                                        Your submission status
                                    </CardDescription>
                                </div>
                                <CardAction>
                                    <div className='cursor-pointer flex flex-col justify-center items-center gap-1 h-14 bg-primary-main hover:bg-primary-light text-primary-contrast py-[1.5] px-3 rounded-lg'>
                                        <MailOpen />
                                        <span className='text-xs'>
                                            {data.status.toUpperCase()}
                                        </span>
                                    </div>
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
                                                top: targetOffsetTop - (isMobile ? 60 : 160), //  - 140 + 80,
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
                                                <StepperTrigger className="items-start gap-2.5 pb-8 last:pb-0">
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
                                <Button
                                    onClick={nextStep}
                                    disabled={activeId !== 'abstract-review'}
                                >
                                    Accept
                                </Button>
                            </CardFooter>
                        </div>
                    </aside>
                )}
            </div>
        </>
    )
}

export default EditAbstractPage
