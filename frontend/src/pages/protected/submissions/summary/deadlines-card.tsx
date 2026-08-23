import React from 'react'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTitle, StepperTrigger, useStepper } from '@/components/reui/stepper'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { AlarmClockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const items = [
    {
        title: 'October 15, 2026',
        description: 'Abstract submission',
    },
    {
        title: 'November 1, 2026',
        description: 'Abstract Reviews',
    },
    {
        title: 'November 15, 2026',
        description: 'Results announcement',
    },
] as const;

function DeadlinesCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row-reverse items-center justify-start">
                <CardAction className="order-2">
                    <AlarmClockIcon className="text-primary-main" />
                </CardAction>

                <CardTitle className="order-1 mr-auto text-lg">
                    Submission Deadline
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Stepper orientation='vertical'>
                    <StepperNav className='w-full'>
                        {items.map((item, i) => <Item
                            key={i}
                            title={item.title}
                            description={item.description}
                            step={i + 1}
                        />)}
                    </StepperNav>
                </Stepper>
            </CardContent>
        </Card>
    )
}

export default DeadlinesCard


type ItemProps = {
    title: string
    description: string
    step: number
}

function Item({ title, description, step }: ItemProps) {

    const { stepsCount } = useStepper()

    return (
        <StepperItem step={step} className="relative w-full flex-1 items-start not-last:flex-1">
            <StepperTrigger className='pb-8 w-full'>
                <StepperIndicator className='size-4 mb-4'></StepperIndicator>
                <div className='text-left ml-2'>
                    <StepperTitle className='text-primary-main'>
                        {title}
                    </StepperTitle>
                    <StepperDescription>
                        {description}
                    </StepperDescription>
                </div>
            </StepperTrigger>

            {step !== stepsCount && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary-main absolute inset-y-0 top-4.5 left-2 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-1.15rem)]" />
            )}
        </StepperItem>
    )
}