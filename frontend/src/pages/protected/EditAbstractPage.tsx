import React, { useCallback, useEffect, useState } from 'react'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import { Stepper, StepperLabel } from '@/components/ui/stepper'
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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export type EditAbstractCallbacks = {
    onStepBack?: () => void
    onStepForward?: () => void
}

function EditAbstractPage() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { data } = useFetch<AbstractSchema>(`/abstracts/${id}/`)
    useEffect(() => {
        if (data?.status === 'submitted') {
            navigate(urls.users.viewAbstracts)
        }
    }, [data])

    const [currStep, setCurrState] = useState(0)
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
            case 0:
                return (<EditAbstractBody onStepBack={() => navigate(urls.users.viewAbstracts)} onStepForward={nextStep} />)
            case 1:
                return (<EditAuthorsPage onStepBack={previousStep} onStepForward={nextStep} />)
            case 2:
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
            case 3:
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

            <div className='mb-4'>
                <p>Abstract Submission Portal</p>
                <h1 className='text-3xl font-medium'>Edit your Abstract</h1>
            </div>

            <Card className="mx-auto w-full gap-y-3 px-5 my-3 pb-2">
                <Stepper activeStep={currStep} setActiveStep={setCurrState} steps={[
                    { label: 'Content' },
                    { label: 'Authors' },
                    { label: 'Declarations' },
                    { label: 'Review' },
                ]} />
            </Card>

            <div className='w-full flex flex-col lg:flex-row gap-5 mx-auto space-y-6 items-start'>
                {data && data.status !== 'submitted' ? (<>

                    <div className='flex-2 w-full'>
                        {renderStep(currStep)}
                    </div>

                    <div className='flex-1 w-full flex justify-center'>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <Card className="mx-auto w-full gap-y-3">
                                <CardHeader>
                                    <CardTitle className='uppercase'>
                                        Submission Status
                                    </CardTitle>
                                    <CardAction>
                                        <Badge>
                                            {data.status.toUpperCase()}
                                        </Badge>
                                    </CardAction>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Your abstract is currently in draft. Once you click "Submit", it will move to the <strong>Review Process</strong>.
                                </CardContent>
                                <CardFooter className="justify-end gap-2">
                                    <Button variant="outline">Decline</Button>
                                    <Button>Accept</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>


                </>) : <Spinner />}
            </div>
        </div>
    )
}

export default EditAbstractPage

