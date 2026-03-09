import { cn } from "@/lib/utils"
import { Progress } from "./progress"
import { CircleCheckBig, CircleEllipsis } from "lucide-react"

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
                'flex flex-1 flex-col gap-2 p-2',
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

export { StepperLabel }