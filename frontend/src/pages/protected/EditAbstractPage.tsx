import React, { useCallback, useEffect, useState } from 'react'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
// import { Stepper, StepperLabel } from '@/components/ui/stepper'
import BeforeSubmitPage from './BeforeSubmitPage'
import EditAuthorsPage from './EditAuthorsPage'
import EditAbstractBody from '@/forms/wrappers/EditAbstractBody'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { urls } from '@/routes/routes'
import { Button } from '@/components/ui/button'
import { Gavel, MessageSquareCode } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import type { AbstractSchema } from '@/schemas/abstract-schemas'
import { Spinner } from '@/components/ui/spinner'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/reui/stepper"
import { CheckIcon, LoaderCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/clients/axiosClient'

export type EditAbstractCallbacks = {
    onStepBack?: () => void
    onStepForward?: () => void
}

function EditAbstractPage() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { data, isLoading } = useQuery<AbstractSchema>({
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
        if (currStep < 3) {
            setCurrState(prev => prev + 1)
        }
    }
    const previousStep = () => {
        if (currStep > 0) {
            setCurrState(prev => prev - 1)
        }
    }

    const [searchParams] = useSearchParams()
    useEffect(() => {
        console.log(Object.fromEntries(searchParams.entries()));

        const action = searchParams.get('action')
        if (action === 'submit') {
            setCurrState(3)
        }
    }, [searchParams])

    const renderStep = useCallback((step: number) => {
        switch (step) {
            case 1:
                return (<EditAbstractBody onStepBack={() => navigate(urls.users.viewAbstracts)} onStepForward={nextStep} />)
            case 2:
                return (<EditAuthorsPage onStepBack={previousStep} onStepForward={nextStep} />)
            case 3:
                return (
                    <div className='w-full space-y-5'>
                        <div className="flex gap-3 items-center">
                            <Gavel className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Abstract Declarations</h2>
                        </div>
                        <Separator />
                        <AbstractDeclarations onStepBack={previousStep} onStepForward={nextStep} />
                    </div>
                )
            case 4:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <div className="flex gap-3 items-center">
                            <MessageSquareCode className='text-primary-main' />
                            <h2 className='text-xl font-semibold'>Abstract Preview</h2>
                        </div>
                        <Separator />
                        <BeforeSubmitPage onStepBack={previousStep} onStepForward={nextStep} />
                    </div>
                )
            default:
                return null
        }
    }, [currStep])


    const steps = [
        {
            title: 'Content',
            label: 'Enter your abstract title, body, and references.',
        },
        {
            title: 'Authors',
            label: 'Add authors and their affiliations.',
        },
        {
            title: 'Declarations',
            label: 'Review and accept the required declarations.',
        },
        {
            title: 'Review',
            label: 'Review your submission and submit your abstract.',
        },
    ]

    return (
        <div className='w-full max-w-6xl mx-auto'>
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

            <div className='w-full flex flex-col lg:flex-row gap-5 mx-auto space-y-6 items-start'>
                {data && data.status !== 'submitted' ? (
                    <Stepper
                        onValueChange={v => {
                            if (v > 4) {
                                setCurrState(4)
                            } else if (v < 1) {
                                setCurrState(1)
                            } else {
                                setCurrState(v)
                            }
                        }}
                        value={currStep}
                        defaultValue={1}
                        className="w-full flex flex-col lg:flex-row gap-5 mx-auto space-y-6 items-start"
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
                        <StepperPanel className="flex-2 w-full">
                            <div className='mb-4'>
                                <p>Abstract Submission Portal</p>
                                <h1 className='text-3xl font-medium'>Edit your Abstract</h1>
                            </div>
                            {renderStep(currStep)}
                        </StepperPanel>
                        <Card className='flex-1 w-full'>
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
                                <StepperNav>
                                    {steps.map((step, index) => (
                                        <StepperItem
                                            key={index}
                                            step={index + 1}
                                            className="relative items-start not-last:flex-1"
                                        >
                                            <StepperTrigger className="items-start gap-2.5 pb-12 last:pb-0">
                                                <StepperIndicator>
                                                    {index + 1}
                                                </StepperIndicator>
                                                <div className="mt-0.5 text-left">
                                                    <StepperTitle>{step.title}</StepperTitle>
                                                    <StepperDescription>{step.label}</StepperDescription>
                                                </div>
                                            </StepperTrigger>
                                            {index < steps.length - 1 && (
                                                <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]" />
                                            )}
                                        </StepperItem>
                                    ))}
                                </StepperNav>
                            </CardContent>
                            <CardContent className="text-sm text-muted-foreground">
                                Your abstract is currently in draft. Once you click "Submit", it will move to the <strong>Review Process</strong>.
                            </CardContent>
                            <CardFooter className="justify-end gap-2">
                                <Button variant="outline">Decline</Button>
                                <Button>Accept</Button>
                            </CardFooter>
                        </Card>
                    </Stepper>
                ) : <Spinner />}
            </div>
        </div>
    )
}

export default EditAbstractPage
