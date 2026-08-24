import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon, } from "lucide-react"
import type React from "react"
import { toast, type ExternalToast } from "sonner"

type Variant = "default" | "success" | "warning" | "destructive" | "info"

export type ToastId = string | number

export type NotifyRenderProps = {
    id: ToastId
    dismiss: () => void
}

export type NotifyContent =
    | React.ReactNode
    | ((props: NotifyRenderProps) => React.ReactNode)


export type NotifyOptions = Omit<ExternalToast, "action" | "cancel" | "icon" | "description" | "unstyled"> & {
    description?: React.ReactNode
    content?: NotifyContent
    icon?: React.ReactNode | false
    action?: { label?: React.ReactNode; onClick?: () => void }
    closable?: boolean
    role?: React.AriaRole
}

export type NotifyCustomOptions = Omit<NotifyOptions, "content" | "description" | "icon"> & {
    unstyled?: boolean
}

const DEFAULT_DURATION = 4000
const DEFAULT_POSITION = "top-center" as const


const variants: Record<
    Variant,
    { icon: LucideIcon; box: string; icono: string; button: string }
> = {
    default: {
        icon: Info,
        box: "bg-card border-primary-light/50 border-l-primary-main border-l-8 rounded-sm",
        icono: "text-slate-600 dark:text-slate-300",
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
        box: "bg-amber-100 border-amber-200 border-l-amber-500 border-l-8 rounded-sm dark:bg-amber-950 dark:border-amber-800",
        icono: "text-amber-500 dark:text-amber-400",
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


function resolveContent(content: NotifyContent, props: NotifyRenderProps): React.ReactNode {
    return typeof content === "function" ? content(props) : content
}


function show(variant: Variant, title: string, options: NotifyOptions = {}) {
    const {
        description,
        content,
        icon,
        action,
        closable = true,
        className,
        role,
        duration = DEFAULT_DURATION,
        position = DEFAULT_POSITION,
        ...rest
    } = options

    const { icon: Icon, box, icono, button } = variants[variant]

    return toast.custom(
        (id) => {
            const dismiss = () => toast.dismiss(id)

            return (
                <div
                    role={role ?? (variant === "destructive" ? "alert" : "status")}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border-3 p-2 mx-auto shadow-md",
                        "w-[calc(100vw-2rem)] max-w-89",
                        "md:w-100 md:max-w-100 md:min-h-18",
                        "text-foreground",
                        box,
                        className
                    )}
                >
                    {icon === false ? null : icon ? (
                        <span className={cn("mt-0.5 shrink-0", icono)}>{icon}</span>
                    ) : (
                        <Icon className={cn("mt-0.5 size-7 shrink-0", icono)} />
                    )}

                    <div className="min-w-0 flex-1 text-xs">
                        {content ? (
                            resolveContent(content, { id, dismiss })
                        ) : (
                            <>
                                <p className="text-sm font-medium leading-none mb-1">{title}</p>

                                {isString(description) ? (
                                    <p className="text-sm opacity-80">{description}</p>
                                ) : (
                                    description
                                )}
                            </>
                        )}
                    </div>

                    {closable && (
                        <button
                            type="button"
                            aria-label="Cerrar"
                            onClick={() => {
                                action?.onClick?.()
                                dismiss()
                            }}
                            className={cn(
                                "rounded-md px-1 py-1 text-xs font-medium underline-offset-2 mb-auto",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                                button
                            )}
                        >
                            {action?.label ?? <X className="size-4" />}
                        </button>
                    )}
                </div>
            )
        },
        { duration, position, ...rest }
    )
}

function custom(content: NotifyContent, options: NotifyCustomOptions = {}, variant?: Variant | undefined) {
    const {
        action,
        closable = false,
        className,
        role = "status",
        unstyled = false,
        duration = DEFAULT_DURATION,
        position = DEFAULT_POSITION,
        ...rest
    } = options

    const { icon: Icon, box, icono, button } = variant
        ? variants[variant]
        : {}

    

    return toast.custom(
        (id) => {
            const dismiss = () => toast.dismiss(id)
            const node = resolveContent(content, { id, dismiss })

            if (unstyled) return <>{node}</>

            return (
                <div
                    role={role}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border bg-card mx-auto shadow-md",
                        "text-foreground",
                        "w-[calc(100vw-2rem)] max-w-89",
                        "md:w-100 md:max-w-100 md:min-h-18",
                        box,
                        className
                    )}
                >
                    <div className="min-w-0 flex-1">{node}</div>

                    {closable && (
                        <button
                            type="button"
                            aria-label="Cerrar"
                            onClick={() => {
                                action?.onClick?.()
                                dismiss()
                            }}
                            className={cn(
                                "rounded-md px-1 py-1 text-xs font-medium mb-auto hover:bg-foreground/5",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                            )}
                        >
                            {action?.label ?? <X className="size-4" />}
                        </button>
                    )}
                </div>
            )
        },
        { duration, position, ...rest }
    )
}

export const notify = {
    default: (t: string, o?: NotifyOptions) => show("default", t, o),
    success: (t: string, o?: NotifyOptions) => show("success", t, o),
    warning: (t: string, o?: NotifyOptions) => show("warning", t, o),
    destructive: (t: string, o?: NotifyOptions) => show("destructive", t, o),
    info: (t: string, o?: NotifyOptions) => show("info", t, o),
    custom: (c: NotifyContent, o?: NotifyCustomOptions, v?: Variant) => custom(c, o, v),
    dismiss: toast.dismiss,
    promise: toast.promise,
}
