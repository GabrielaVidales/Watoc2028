import axios, { type AxiosRequestConfig } from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || ''

const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const axiosGuestInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosClient.interceptors.response.use(
    (config) => config,
    async (error) => {
        if (error.status !== 401) {
            return Promise.reject(error)
        }

        try {
            const originalRequest = error.config as AxiosRequestConfig
            await axiosGuestInstance.post('/token/refresh/');
            if (import.meta.env.DEV) {
                console.log("Refreshing access token...!");
            }
            return axiosClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
)

function getCookie(name: string) {
    var cookies = '; ' + document.cookie;
    var splitCookie = cookies.split('; ' + name + '=');
    if (splitCookie.length == 2) return splitCookie.pop();
}

export default axiosClient