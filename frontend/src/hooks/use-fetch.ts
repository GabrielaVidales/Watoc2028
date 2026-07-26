import api from "@/clients/api"
import { isAxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"

export const useFetch = <T>(url?: string | null) => {
    const [data, setData] = useState<T>(null)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        if (!url) return

        setFetching(true)
        try {
            const res = await api.get<T>(url)
            setData(res.data)
            setError(null)            
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
            setError(error)
        } finally {
            setFetching(false)
        }
    }, [url])

    useEffect(() => { fetchData() }, [fetchData])

    return { data, fetching, error, fetchData, setData }
}
