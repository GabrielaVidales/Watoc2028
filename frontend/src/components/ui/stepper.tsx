import { cn } from "@/lib/utils"
import { Check, CircleCheckBig, CircleEllipsis } from "lucide-react"
import { Progress } from "./progress"
import { Button } from "./button"

interface Step {
    label: string
}

type StepperProps = React.ComponentProps<'div'> & {
    steps: Step[]
    activeStep: number
    setActiveStep: (n: number) => void
}

function Stepper({ steps, activeStep, setActiveStep, className }: StepperProps) {
    const progress = Math.min(((activeStep / (steps.length)) + ((1 / steps.length) / 2)) * 100, 100)

    return (
        <div className={cn("w-full", className)}>
            <Progress value={progress} className="h-1" />

            <div className="flex items-start">
                {steps.map((step, index) => {
                    const completed = index < activeStep;
                    const active = index === activeStep;

                    return (
                        <Button
                            key={step.label}
                            variant="ghost"
                            className="flex flex-1 h-auto w-fit flex-col items-center p-2"
                            onClick={() => setActiveStep(steps.indexOf(step))}
                        >
                            <div className="flex flex-col items-center w-full">
                                <div
                                    className={cn(
                                        "flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                                        completed && "border-primary bg-primary text-primary-foreground",
                                        active && "border-background shadow-md bg-muted text-primary outline-3 outline-primary-main",
                                        !completed && !active && "border-muted-foreground bg-background text-muted-foreground"
                                    )}
                                >
                                    {completed ? (
                                        <Check className="size-3 sm:size-4 stroke-3" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                <span
                                    className={cn(
                                        "mt-2 text-center text-xs transition-colors duration-500 text-wrap",
                                        active ? "font-semibold text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}


type StepperLabelProps = React.ComponentProps<'div'> & {
    completed: boolean
    label: string
}

function StepperLabel({
    completed,
    label,
    className,
    ...props
}: StepperLabelProps) {


    return (
        <div
            className={cn(
                'flex flex-1 flex-col gap-2 py-2',
                completed ? 'text-primary-main' : 'text-gray-400',
                className
            )}
            {...props}
        >
            <Progress
                value={completed ? 100 : 0}
                className={cn(
                    'h-1',
                )}
                indicatorClassName={cn(
                    completed ? 'bg-primary-main' : 'bg-gray-400',
                )}
            />
            <div className='flex gap-2'>
                {completed ? (
                    <CircleCheckBig className='shrink-0' />
                ) : (
                    <CircleEllipsis className='shrink-0' />
                )}
                <div className='flex flex-col font-semibold'>
                    <span className='text-sm'>
                        {label}
                    </span>
                    <span className='text-xs tracking-wide'>{completed ? 'Completed' : 'Pending'}</span>
                </div>
            </div>
        </div>
    )
}

export { StepperLabel, Stepper }