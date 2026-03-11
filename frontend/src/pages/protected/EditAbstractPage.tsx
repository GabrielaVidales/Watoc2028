import React, { useCallback, useEffect, useState } from 'react'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import { StepperLabel } from '@/components/ui/stepper'
import BeforeSubmitPage from './BeforeSubmitPage'
import EditAuthorsPage from './EditAuthorsPage'
import EditAbstractBody from '@/forms/wrappers/EditAbstractBody'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { urls } from '@/routes/routes'
import { Button } from '@/components/ui/button'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import type { AbstractSchema } from '@/schemas/abstract-schemas'
import { Spinner } from '@/components/ui/spinner'
import { useHeader } from '@/contexts/HeaderContext'

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
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Declarations</h2>
                        <AbstractDeclarations onStepBack={previousStep} onStepForward={nextStep} />
                    </div>
                )
            case 3:
                return (<>
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Preview</h2>

                        <BeforeSubmitPage onStepBack={previousStep} onStepForward={nextStep} />
                    </div>
                </>)
            default:
                return null
        }
    }, [currStep])


    const stepData = [
        {
            step: 0,
            label: '1. Abstract Content',
        },
        {
            step: 1,
            label: '2. Authors',
        },
        {
            step: 2,
            label: '3. Declarations',
        },
        {
            step: 3,
            label: 'Submit',
        },
    ]

    return (
        <div className='w-full max-w-5xl mx-auto space-y-6 p-4'>
            {data && data.status !== 'submitted' ? (<>
                <div className='w-full flex justify-center'>
                    <div className='w-full bg-background border-2 rounded-lg shadow-sm p-4 border-t-10 border-primary-main'>
                        <div className='flex flex-col sm:flex-row w-full gap-1'>
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                onClick={previousStep}
                                disabled={currStep === 0}
                            >
                                <ChevronsLeft />
                            </Button>
                            {stepData.map(step => (
                                <StepperLabel
                                    key={step.step}
                                    completed={currStep >= step.step}
                                    label={step.label}
                                    className='cursor-pointer'
                                    onClick={() => setCurrState(step.step)}
                                />
                            ))}
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                onClick={nextStep}
                                disabled={currStep === 3}
                            >
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='w-full flex justify-center'>
                    <div className='w-full bg-background border-2 rounded-xl shadow-sm p-6 min-h-80 flex flex-col'>
                        {renderStep(currStep)}
                    </div>
                </div>
            </>) : <Spinner />}
        </div>
    )
}

export default EditAbstractPage

