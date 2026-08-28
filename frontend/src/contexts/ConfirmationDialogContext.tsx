import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import React, { createContext, useCallback, useContext, useRef, useState, type PropsWithChildren } from "react";


export type ConfirmOptions = {
    title?: React.ReactNode
    description?: React.ReactNode
    btnLabel?: string
    cancelBtnLabel?: string
    onConfirm?: () => Promise<unknown> | void | any
    onCancel?: () => void
}


type ConfirmContextValue = (options?: ConfirmOptions) => Promise<boolean>


const ConfirmContext = createContext<ConfirmContextValue | null>(null)


export const useConfirm = () => {
    const context = useContext(ConfirmContext)
    if (!context) {
        throw new Error('useConfirm must be used within an ConfirmProvider')
    }
    return context;
}


export const ConfirmProvider = ({ children }: PropsWithChildren) => {
    const [options, setOptions] = useState<ConfirmOptions | null>(null)
    const [loading, setLoading] = useState(false)
    const resolverRef = useRef<((v: boolean) => void) | null>(null)

    const confirm = useCallback<ConfirmContextValue>((opts = {}) => {
        setOptions(opts)
        return new Promise<boolean>((resolve) => {
            resolverRef.current = resolve
        })
    }, [])

    const handleConfirm = async () => {
        if (options?.onConfirm) {
            setLoading(true)
            try {                
                await options?.onConfirm()
                close(true)
            } catch {
                close(false)
            }
            return
        }

        close(true)
    }

    const close = (confirm: boolean) => {
        if (!confirm) {
            options?.onCancel?.()
        }
        resolverRef.current?.(confirm)
        resolverRef.current = null
        setLoading(false)
        setOptions(null)
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <ConfirmationDialog
                open={options !== null}
                loading={loading}
                title={options?.title}
                description={options?.description}
                btnLabel={options?.btnLabel}
                cancelBtnLabel={options?.cancelBtnLabel}
                onConfirm={handleConfirm}
                onCancel={() => close(false)}
            />
        </ConfirmContext.Provider>
    )
}
