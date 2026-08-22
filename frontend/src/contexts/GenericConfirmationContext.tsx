import { createContext, useCallback, useContext, useRef, useState, type PropsWithChildren } from "react";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import type { ConfirmOptions } from "./ConfirmationDialogContext";


type GenericConfirmOptions<T> = {
    resolveFn?: () => Promise<T>
    keepPreviousData?: boolean
    options?: ConfirmOptions
}


type GenericConfirmContextResolver<T> = (options?: GenericConfirmOptions<T>) => Promise<T>


type GenericConfirmContextValue<T> = {
    confirm: GenericConfirmContextResolver<T>
    clearData?: () => void
    resolvedData?: T
}


const GenericConfirmContext = createContext<GenericConfirmContextValue<any> | null>(null)


export const useGenericConfirm = <T,>() => {
    const context = useContext(GenericConfirmContext)
    if (!context) {
        throw new Error('useConfirm must be used within an ConfirmProvider')
    }
    return context as GenericConfirmContextValue<T>;
}


export const GenericConfirmProvider = <T,>({ children }: PropsWithChildren) => {
    const [genericOptions, setGenericOptions] = useState<GenericConfirmOptions<T> | null>(null)
    const [resolvedData, setResolvedData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const resolverRef = useRef<((v: T) => void) | null>(null)

    const confirm = useCallback<GenericConfirmContextResolver<T>>((opts = {}) => {
        setGenericOptions(opts)
        return new Promise<T>((resolve) => {
            resolverRef.current = resolve
        })
    }, [])

    const handleConfirm = async () => {
        if (genericOptions?.resolveFn) {
            setLoading(true)

            if (genericOptions?.keepPreviousData === false) {
                setResolvedData(null)
            }

            try {
                const data = await genericOptions?.resolveFn()

                setResolvedData(data)

                if (genericOptions?.options?.onConfirm) {
                    await genericOptions?.options?.onConfirm()
                }

                close(data)

            } catch {
                close(null)
            }
            return
        }

        close(null)
    }

    const close = (confirm: T | null) => {
        if (!confirm) {
            genericOptions?.options?.onCancel?.()
        }
        resolverRef.current?.(confirm)
        resolverRef.current = null
        setLoading(false)
        setGenericOptions(null)
    }

    const clearData = () => {
        if (resolvedData) {
            setResolvedData(null)
        }
    }

    const value: GenericConfirmContextValue<T> = {
        confirm,
        resolvedData,
        clearData,
    }

    return (
        <GenericConfirmContext.Provider value={value}>
            {children}

            <ConfirmationDialog
                open={genericOptions !== null}
                loading={loading}
                title={genericOptions?.options?.title}
                description={genericOptions?.options?.description}
                btnLabel={genericOptions?.options?.btnLabel}
                cancelBtnLabel={genericOptions?.options?.cancelBtnLabel}
                onConfirm={handleConfirm}
                onCancel={() => close(null)}
            />
        </GenericConfirmContext.Provider>
    )
}
