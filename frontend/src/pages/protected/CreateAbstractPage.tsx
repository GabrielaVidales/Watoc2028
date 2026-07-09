'deprecar'

import AbstractForm from '@/forms/AbstractForm'
import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InfoAlert } from '@/components/InfoAlert'


function CreateAbstractPage() {
    return (
        <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 p-3 mx-auto'>
            <div className='md:col-span-2 w-full'>
                <div className='w-full bg-background border-2 p-7 rounded-lg shadow-lg flex flex-col gap-5'>
                    <div className='w-full space-y-5'>
                        <h2 className='text-2xl font-semibold'>Abstract Submission</h2>
                        <AbstractForm />
                    </div>
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
                        <Button form='abstract-submission-form'>
                            Create abstract
                        </Button>
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

export default CreateAbstractPage
