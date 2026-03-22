import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router'
import { urls } from '@/routes/routes'
import SelectFeeForm from './select-fee-form'


export function SelectFeePage() {
    return (
        <div className='max-w-4xl mx-auto bg-background shadow-2xl space-y-3 my-6 border-t-8 border-t-primary-main rounded-sm overflow-hidden'>
            <section className='space-y-5 p-10 shadow-lg'>
                <h1 className='text-2xl font-medium text-primary-main'>Welcome to the WATOC 2028 Registration!</h1>
                <SelectFeeForm />
                <Button form='select-fee-form'>
                    Save
                </Button>
            </section>


            <section className={cn(
                'flex justify-between items-start bg-primary-light/20',
                'px-10 py-3 mx-auto mt-auto bottom-0'
            )}>
                <Link to={urls.users.confirmAssistance.start}>
                    <Button type='button'>
                        <ChevronLeft />
                        Back
                    </Button>
                </Link>

                <Link to={urls.users.confirmAssistance.dinner}>
                    <Button type='button'>
                        Next
                        <ChevronRight />
                    </Button>
                </Link>
            </section>
        </div>
    )
}

