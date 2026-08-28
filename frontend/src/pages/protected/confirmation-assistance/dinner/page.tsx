import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DinnerForm from '@/pages/protected/confirmation-assistance/dinner/dinner-form'
import { routes } from '@/routes/routes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'


export function DinnerPage() {
    return (
        <div className='max-w-4xl mx-auto bg-background shadow-2xl space-y-3 my-6 border-t-8 border-t-primary-main rounded-sm overflow-hidden'>
            <section className='space-y-5 p-10 shadow-lg'>
                <h1 className='text-2xl font-medium text-primary-main'>Welcome to the WATOC 2028 Registration!</h1>
                <DinnerForm />
            </section>


            <section className={cn(
                'flex justify-between items-start bg-primary-light/20',
                'px-10 py-3 mx-auto mt-auto bottom-0'
            )}>
                <Link to={routes.users.confirmAssistance.fee}>
                    <Button type='button'>
                        <ChevronLeft />
                        Back
                    </Button>
                </Link>

                <Link to={routes.users.confirmAssistance.tour}>
                    <Button type='button'>
                        Next
                        <ChevronRight />
                    </Button>
                </Link>
            </section>
        </div>
    )
}