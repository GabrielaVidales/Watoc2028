import React, { useState } from 'react'
import { Link } from 'react-router'
import { urls } from '@/routes/routes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FieldContent, FieldDescription, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import axiosClient from '@/clients/axiosClient'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'


function ConfirmPaymentPage() {
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const onProceedPayment = async () => {
        try {
            setLoading(true)
            const res = await axiosClient.post('/payments/create-checkout-session/')
            console.log(res);
            console.log(res.data.checkout_url);

            const checkoutUrl = res.data.checkout_url
            window.location.assign(checkoutUrl)

        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error.response);
            }
        } finally {
            setLoading(false)
        }

    }


    return (
        <div className='max-w-4xl mx-auto bg-background shadow-2xl space-y-3 my-6 border-t-8 border-t-primary-main rounded-sm overflow-hidden'>
            <section className='space-y-5 p-10 shadow-lg'>
                <h1 className='text-2xl font-medium text-primary-main'>Proceed with Payment</h1>
                <div className="space-y-3">
                    <h3 className="text-base font-semibold">Online Payment</h3>
                    <p className="text-sm">
                        All payments are securely processed through Stripe.
                    </p>
                    <p className="text-sm">
                        We accept major credit and debit cards.
                    </p>
                    <p className="text-sm">
                        To complete your registration, please enter your payment details and click on
                        "Complete Payment". The authorization process usually takes a few seconds.
                    </p>
                    <p className="text-sm">
                        During this time, please do not refresh the page or use the browser’s back button,
                        as this may interrupt the transaction and could result in duplicate charges.
                    </p>
                    <p className="text-sm">
                        Once the payment is successfully authorized, you will be automatically redirected
                        to the confirmation page.
                    </p>
                </div>

                <Separator className='my-8' />

                <FieldSet disabled={loading}>
                    <FieldTitle>
                        Payment Method
                    </FieldTitle>
                    <RadioGroup defaultValue="" onValueChange={(value) => setChecked(value === 'true')}>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value={'true'} id="checked" />
                            <Label htmlFor="checked">Online Payment</Label>
                        </div>
                    </RadioGroup>
                    {checked && (
                        <Button type='button' onClick={onProceedPayment}>
                            {loading && <Spinner />}
                            Proceed to Checkout
                            <ExternalLink />
                        </Button>
                    )}
                </FieldSet>
            </section>

            <section className={cn(
                'flex justify-between items-start bg-primary-light/20',
                'px-10 py-3 mx-auto mt-auto bottom-0'
            )}>
                <Link to={urls.users.confirmAssistance.tour}>
                    <Button type='button'>
                        <ChevronLeft />
                        Back
                    </Button>
                </Link>

                <Link to={urls.users.confirmAssistance.payment}>
                    <Button type='button'>
                        Next
                        <ChevronRight />
                    </Button>
                </Link>
            </section>
        </div>
    )
}

export default ConfirmPaymentPage