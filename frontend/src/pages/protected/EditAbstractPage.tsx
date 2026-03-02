import { useFetch } from '@/hooks/use-fetch'
import type { AbstractSchema } from '@/schemas/abstract-schemas'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InfoAlert } from './CreateAbstractPage'
import AbstractForm from '@/forms/AbstractForm'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import AuthorForm from '@/forms/AuthorForm'


function EditAbstractPage() {
    const { id } = useParams()
    const { data } = useFetch<AbstractSchema>(`/abstracts/${id}/`)

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
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Submission</h2>
                        <AbstractForm abstract={data} />
                    </div>
                )
            case 1:
                return (
                    <div className='w-full space-y-5 p-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Submission</h2>
                        <AuthorForm />
                    </div>
                )
            default:
                return null
        }
    }, [data])

    return (
        <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 p-3 mx-auto'>
            <div className='col-span-2 min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
                    <Tabs defaultValue="home">
                        <TabsList variant='line' className='w-full'>
                            <TabsTrigger value="home">
                                Abstract Content
                            </TabsTrigger>
                            <TabsTrigger value="account">
                                Authors
                            </TabsTrigger>
                            <TabsTrigger value="picture">
                                Declarations
                            </TabsTrigger>
                            <TabsTrigger value="password">
                                Submit
                            </TabsTrigger>
                        </TabsList>

                        {renderStep(currStep)}
                    </Tabs>
                </div>
            </div>

            <div className='col-span-1 flex flex-col gap-3'>
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