import axiosClient from "@/clients/axiosClient"
import { isAxiosError } from "axios"
import { useCallback, useState } from "react"


export const useMutation = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const mutate = useCallback(async <T>(
        method: 'post' | 'patch' | 'put' | 'delete',
        url: string,
        body?: any
    ) => {
        setLoading(true)
        setError(null)
        try {
            await new Promise(r=>setTimeout(r, 200))

            const res = await axiosClient[method]<T>(url, body)
            return res.data
        } catch (err) {
            if (import.meta.env.DEV) {
                if (isAxiosError(err)) {
                    console.error(`[Mutation Error] ${method.toUpperCase()} ${url}:`, err.response?.data)
                }
            }
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { mutate, loading, error, setError }
}