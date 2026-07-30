import { CheckCircle2, AlertTriangle, XCircle, Info, type LucideIcon, X, } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type React from "react"

type Variant = "default" | "success" | "warning" | "destructive" | "info"

type NotifyOptions = {
    description?: string | React.ReactNode
    duration?: number
    action?: { onClick: () => void }
}

const variants: Record<
    Variant,
    { icon: LucideIcon; box: string; icono: string; button: string }
> = {
    default: {
        icon: Info,
        box: "bg-slate-200 border-slate-300 border-l-slate-600 border-l-8 rounded-sm dark:bg-slate-900 dark:border-slate-700",
        icono: "text-slate-700 dark:text-slate-300",
        button: "hover:bg-slate-500/10",
    },
    success: {
        icon: CheckCircle2,
        box: "bg-green-100 border-green-200 border-l-green-600 border-l-8 rounded-sm dark:bg-green-950 dark:border-green-800",
        icono: "text-green-700 dark:text-green-400",
        button: "hover:bg-green-600/10",
    },
    warning: {
        icon: AlertTriangle,
        box: "bg-amber-200 border-amber-300 border-l-amber-600 border-l-8 rounded-sm dark:bg-amber-950 dark:border-amber-800",
        icono: "text-amber-700 dark:text-amber-400",
        button: "hover:bg-amber-600/10",
    },
    destructive: {
        icon: XCircle,
        box: "bg-red-200 border-red-300 border-l-red-600 border-l-6 rounded-sm dark:bg-red-950 dark:border-red-800",
        icono: "text-red-700 dark:text-red-400",
        button: 'hover:bg-red-600/10',
    },
    info: {
        icon: Info,
        box: "bg-sky-200 border-sky-300 border-l-sky-600 border-l-8 rounded-sm dark:bg-sky-950 dark:border-sky-800",
        icono: "text-sky-700 dark:text-sky-400",
        button: "hover:bg-sky-600/10",
    },
}

function isString(value: React.ReactNode): value is string {
    return typeof value === 'string';
}

function show(
    variant: Variant,
    title: string,
    { description, duration = 4000, action }: NotifyOptions = {}
) {
    const { icon: Icon, box, icono, button } = variants[variant]

    return toast.custom(
        (id) => (
            <div
                role={variant === "destructive" ? "alert" : "status"}
                className={cn(
                    "flex w-full items-center gap-3 rounded-lg border-3 p-2 shadow-md",
                    "md:w-90 md:min-h-18 text-foreground",
                    box
                )}
            >
                <Icon className={cn("mt-0.5 size-10 shrink-0", icono)} />

                <div className="flex-1 text-xs font-medium">
                    <p className="text-sm font-bold leading-none mb-1">{title}</p>

                    {isString(description) ? (
                        <p className="text-sm opacity-80">{description}</p>
                    ) : (
                        description
                    )}
                </div>

                <button
                    onClick={() => {
                        action?.onClick()
                        toast.dismiss(id)
                    }}
                    className={cn(
                        "rounded-md px-1 py-1 text-xs font-medium underline-offset-2 mb-auto",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                        button
                    )}
                >
                    <X className="size-4" />
                </button>
            </div>
        ),
        {
            duration,
            position: 'top-center',
        }
    )
}

export const notify = {
    default: (t: string, o?: NotifyOptions) => show("default", t, o),
    success: (t: string, o?: NotifyOptions) => show("success", t, o),
    warning: (t: string, o?: NotifyOptions) => show("warning", t, o),
    destructive: (t: string, o?: NotifyOptions) => show("destructive", t, o),
    info: (t: string, o?: NotifyOptions) => show("info", t, o),
    dismiss: toast.dismiss,
    promise: toast.promise,
}
