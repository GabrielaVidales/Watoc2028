import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { InfoIcon } from 'lucide-react'
import React, { type ComponentProps } from 'react'


type AdaptableTooltipProps = {
    content?: React.ReactNode;
    triggerClassName?: string;
    children?: React.ReactNode;
} & Omit<ComponentProps<typeof TooltipContent>, "content">;

function AdaptableTooltip({
    content,
    children,
    triggerClassName,
    className,
    ...props
}: AdaptableTooltipProps) {
    const isMobile = useIsMobile()

    const trigger = children ?? (
        <InfoIcon
            className={cn(
                "size-4 shrink-0 text-muted-foreground",
                triggerClassName,
            )}
        />
    )

    if (isMobile) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    {trigger}
                </PopoverTrigger>

                <PopoverContent
                    className={cn(
                        "max-w-60 border-0 bg-black px-3 py-1.5 text-[10px] font-normal text-white dark:bg-white dark:text-black",
                        className,
                    )}
                >
                    {content}
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {trigger}
            </TooltipTrigger>

            <TooltipContent
                className={cn("max-w-60", className)}
                {...props}
            >
                {content}
            </TooltipContent>
        </Tooltip>
    );
}

export default AdaptableTooltip