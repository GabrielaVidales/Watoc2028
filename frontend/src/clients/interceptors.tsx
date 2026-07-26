import axios, { isAxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

type InterceptorsConfig = {
    request?: boolean
    response?: boolean
}

export default function setupInterceptors(api: AxiosInstance, config: InterceptorsConfig = { request: true, response: true }) {
    if (config?.request) {
        api.interceptors.request.use(
            (config) => {
                const token = Cookies.get('csrftoken');
                
                if (token) {
                    config.headers['X-CSRFToken'] = token;
                }

                return config
            },
        )
    }
    if (config?.response) {
        api.interceptors.response.use(
            (config) => config,
            async (error) => {
                if (isAxiosError(error) && error.status === 401) {
                    try {
                        const BASE_URL = import.meta.env.VITE_API_URL || ''
                
                        await axios.post(BASE_URL + '/auth/token/refresh/', {}, { withCredentials: true });
                
                        if (import.meta.env.DEV) {
                            console.log("Refreshing access token...!");
                        }
                
                        return api(error.config as AxiosRequestConfig);

                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error)
            }
        )
    }
}
