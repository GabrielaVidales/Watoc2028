import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { routes } from '@/routes/routes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'


function ConfirmationPage() {

    return (
        <div className='max-w-4xl mx-auto bg-background shadow-2xl space-y-3 my-6 border-t-8 border-t-primary-main rounded-sm overflow-hidden'>
            <section className='space-y-5 p-10 shadow-lg'>
                <h1 className='text-2xl font-medium text-primary-main'>Welcome to the WATOC 2028 Registration!</h1>
                <p>
                    You will receive an automatic confirmation e-mail upon completion of your registration.
                    In case you would like to register more than 5 delegates and need one collective invoice, please contact Mondial GmbH & Co KG .
                </p>
                <p>A detailed overview of the registration fees and the respective due dates for payment can be found here.</p>
            </section>

            <section className={cn(
                'flex justify-between items-start bg-primary-light/20',
                'px-10 py-3 mx-auto mt-auto bottom-0'
            )}>
                <Link to={routes.users.profile}>
                    <Button type='button'>
                        <ChevronLeft />
                        Back
                    </Button>
                </Link>

                <Link to={routes.users.confirmAssistance.fee}>
                    <Button type='button'>
                        Next
                        <ChevronRight />
                    </Button>
                </Link>
            </section>
        </div>
    )
}

export default ConfirmationPage
