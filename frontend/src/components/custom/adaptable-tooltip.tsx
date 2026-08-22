import { useIsMobile } from '@/hooks/use-mobile'
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import React, { type HTMLAttributes } from 'react'
import { InfoIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"


type AdaptableTooltipProps = {
    tooltipContent?: React.ReactNode
    buttonClassNames?: string
}

function AdaptableTooltip({
    tooltipContent,
    buttonClassNames,
    className,
}: AdaptableTooltipProps & HTMLAttributes<HTMLDivElement>) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <InfoIcon className={cn(
                        'size-3 shrink-0 text-muted-foreground',
                        buttonClassNames,
                    )} />
                </PopoverTrigger>
                <PopoverContent className={cn(
                    'max-w-60 text-xs font-normal py-1.5 px-3 bg-black dark:bg-white text-white dark:text-black',
                    className,
                )}>
                    {tooltipContent || 'Hello world!'}
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <InfoIcon className={cn(
                    'size-3 shrink-0 text-muted-foreground',
                    buttonClassNames,
                )} />
            </TooltipTrigger>
            <TooltipContent className={cn(
                'max-w-60',
                className,
            )}>
                {tooltipContent || 'Hello world!'}
            </TooltipContent>
        </Tooltip>
    )
}

export default AdaptableTooltip