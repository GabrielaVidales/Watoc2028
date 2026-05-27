import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";


type AlertVariant = 'info' | 'warning' | 'destructive' | 'success' | 'custom';

const variantStyles: Record<AlertVariant, string> = {
    info: "border-indigo-200 bg-indigo-100 text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-50",
    warning: "border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
    destructive: "border-red-200 bg-red-100 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
    success: "border-green-400 bg-green-100 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50",
    custom: '',
};

type MyAlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    title: ReactNode
    messages: ReactNode | ReactNode[];
    variant?: AlertVariant,
    icon?: ReactNode
}

export function InfoAlert({ title, messages, className, variant = 'info', icon: Icon, ...props }: MyAlertProps) {
    return (
        <Alert className={cn(variantStyles[variant], className)} {...props}>
            {Icon ? (Icon):(
                <AlertCircleIcon />
            )}
            <AlertTitle className='tracking-wider'>{title}</AlertTitle>
            <AlertDescription className='text-foreground'>
                {Array.isArray(messages) ? (messages as string[]).map((m, i) => (
                    <Fragment key={i}>{m}</Fragment>
                )) : messages}
            </AlertDescription>
        </Alert>
    )
}