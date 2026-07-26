import axios from "axios"
import setupInterceptors from "./interceptors";

const BASE_URL = import.meta.env.VITE_API_URL || ''

const config = {
    baseURL: BASE_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
        'Content-Type': 'application/json'
    }
};

export const api = axios.create(config)
export const guestApi = axios.create(config)

setupInterceptors(guestApi, { request: true })
setupInterceptors(api)

export default api
