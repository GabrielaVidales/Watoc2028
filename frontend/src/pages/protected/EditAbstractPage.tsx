import React, { useCallback, useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import AbstractDeclarations from '@/forms/AbstractDeclarationsForm'
import { StepperLabel } from '@/components/ui/stepper'
import BeforeSubmitPage from './BeforeSubmitPage'
import EditAuthorsPage from './EditAuthorsPage'
import { InfoAlert } from '@/components/InfoAlert'
import EditAbstractBody from '@/forms/wrappers/EditAbstractBody'


function EditAbstractPage() {

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

    const renderStep = useCallback((step: number) => {
        switch (step) {
            case 0:
                return (<EditAbstractBody />)
            case 1:
                return (<EditAuthorsPage />)
            case 2:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Declarations</h2>

                        <AbstractDeclarations />
                    </div>
                )
            case 3:
                return (<>
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Preview</h2>

                        <BeforeSubmitPage />
                    </div>
                </>)
            default:
                return null
        }
    }, [currStep])


    const stepData = [
        {
            step: 0,
            label: 'Abstract Content',
        },
        {
            step: 1,
            label: 'Authors',
        },
        {
            step: 2,
            label: 'Declarations',
        },
        {
            step: 3,
            label: 'Submit',
        },
    ]

    return (
        <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 p-3 mx-auto'>
            <div className='col-span-full w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col'>
                    <div className='flex flex-col sm:flex-row w-full'>
                        {stepData.map(step => (
                            <StepperLabel
                                key={step.step}
                                completed={currStep >= step.step}
                                label={step.label}
                                className='cursor-pointer'
                                onClick={() => setCurrState(step.step)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className='col-span-3 min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col'>
                    {renderStep(currStep)}
                </div>
            </div>

            <div className='col-span-3 flex flex-col gap-3'>
                <Card className='col-span-1 h-fit'>
                    <CardHeader className='items-start justify-start'>
                        <CardTitle>Estado de envío</CardTitle>
                        <CardAction>
                            <Badge>
                                Borrador
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className='text-balance'>
                            Envía tu resumen al proeso de revisión. Puedes modificar tu trabajo después de enviarlo, siempre que sea antes de la fecha límite de envío.
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <div className='w-full flex items-center justify-between'>
                            <Button type='button' onClick={previousStep}>
                                <ChevronsLeft />
                                Back
                            </Button>
                            <Button type='button' onClick={nextStep}>
                                Next
                                <ChevronsRight />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <InfoAlert
                    variant='warning'
                    title='Testeo'
                    messages={[
                        'alskdja sldhas jldas hdjka hskdja shdka sdkj'
                    ]}
                />
            </div>
        </div>
    )
}

export default EditAbstractPage

