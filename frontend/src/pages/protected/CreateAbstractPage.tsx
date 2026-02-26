import AbstractForm from '@/forms/AbstractForm'
import React, { type HTMLAttributes, type ReactNode } from 'react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function CreateAbstractPage() {
    return (
        <div className='bg-slate-200'>
            <h1>Crear abstract</h1>
            <div className='max-w-3xl space-y-9 py-9 mx-auto bg-white p-7 rounded-2xl border-2'>

                <div className='flex flex-col items-center justify-center gap-3 tracking-widest'>
                    <span className='font-semibold text-primary-main text-sm'>WATOC 2028</span>
                    <h2 className='text-4xl font-semibold'>Submit your abstract</h2>
                    <div className='mt-2 h-1 rounded-full w-24 bg-primary-main'></div>
                </div>

                <AbstractForm />
                <div className='grid grid-cols-5'>
                    <div className='col-span-4  '>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAbstractPage

type AlertVariant = 'info' | 'warning' | 'destructive';

const variantStyles: Record<AlertVariant, string> = {
    info: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-50",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
    destructive: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50"
};

type MyAlertProps = {
    title: string
    messages: ReactNode | ReactNode[];
    variant?: AlertVariant,
}

export function InfoAlert({ title, messages, className, variant = 'info', ...props }: MyAlertProps & HTMLAttributes<HTMLDivElement>) {
    return (
        <Alert className={cn(variantStyles[variant], className)} {...props}>
            <AlertCircleIcon />
            <AlertTitle className='tracking-wider'>{title}</AlertTitle>
            <AlertDescription>
                {Array.isArray(messages) ? (messages as string[]).map((m, i) => (
                    <span key={i}>{m}</span>
                )) : messages}
            </AlertDescription>
        </Alert>
    )
}