import axios, { type AxiosRequestConfig } from "axios"

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

export const axiosClient = axios.create(config)

export const axiosGuestInstance = axios.create(config)

axiosGuestInstance.interceptors.request.use(
    (config) => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const token = getCookie('csrftoken');
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }

        return config
    },
)

axiosClient.interceptors.request.use(
    (config) => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const token = getCookie('csrftoken');
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }

        return config
    },
)

axiosClient.interceptors.response.use(
    (config) => config,
    async (error) => {
        if (error.status !== 401) {
            return Promise.reject(error)
        }

        try {
            const originalRequest = error.config as AxiosRequestConfig
            await axiosGuestInstance.post('/auth/token/refresh/');
            if (import.meta.env.DEV) {
                console.log("Refreshing access token...!");
            }
            return axiosClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
)

export default axiosClient