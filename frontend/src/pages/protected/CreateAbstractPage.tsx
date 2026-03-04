import AbstractForm from '@/forms/AbstractForm'
import React, { type HTMLAttributes, type ReactNode } from 'react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


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

type AlertVariant = 'info' | 'warning' | 'destructive' | 'custom';

const variantStyles: Record<AlertVariant, string> = {
    info: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-50",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
    destructive: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
    custom: '',
};

type MyAlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    title: ReactNode
    messages: ReactNode | ReactNode[];
    variant?: AlertVariant,
    icon?: ReactNode
}

export function InfoAlert({ title, messages, className, variant = 'info', icon: Icon, ...props }: MyAlertProps) {
    return (
        <Alert className={cn(variantStyles[variant], className)} {...props}>
            {Icon ? (Icon):(
                <AlertCircleIcon />
            )}
            <AlertTitle className='tracking-wider'>{title}</AlertTitle>
            <AlertDescription>
                {Array.isArray(messages) ? (messages as string[]).map((m, i) => (
                    <span key={i}>{m}</span>
                )) : messages}
            </AlertDescription>
        </Alert>
    )
}