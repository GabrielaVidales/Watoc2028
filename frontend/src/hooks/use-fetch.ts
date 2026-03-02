import axiosClient from "@/clients/axiosClient"
import { isAxiosError } from "axios"
import { useEffect, useState } from "react"

export const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T>(null)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const res = await axiosClient.get<T>(url)
            setData(res.data)
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
    }

    useEffect(() => { fetchData() }, [url])

    return { data, fetching, error, fetchData }
}

