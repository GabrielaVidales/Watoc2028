import axios, { isAxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";


const BASE_URL = import.meta.env.VITE_API_URL || "";
const REFRESH_PATH = "/auth/token/refresh/";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type InterceptorsConfig = {
    request?: boolean
    response?: boolean
}


let refreshPromise: Promise<void> | null = null;

async function refreshToken() {
    // La primera vez que se llama se ejecuta la Promise
    if (!refreshPromise) {
        refreshPromise = axios.post(BASE_URL + REFRESH_PATH, {}, {
            withCredentials: true,
            headers: { "X-CSRFToken": Cookies.get("csrftoken") ?? "" },
        })
            .then(() => {
                if (import.meta.env.DEV) {
                    console.log("Access token refreshed");
                }
            })
            .finally(() => {
                // se libera el "lock" al resolver o fallar
                refreshPromise = null;
            })
    }
    // Las siguientes requests reciben la promise inicializada
    return refreshPromise
}


export default function setupInterceptors(api: AxiosInstance, config: InterceptorsConfig = { request: true, response: true }) {
    if (config?.request) {
        api.interceptors.request.use(
            (config) => {
                config.headers['X-CSRFToken'] = Cookies.get('csrftoken') ?? "";
                return config
            },
        )
    }
    if (config?.response) {
        api.interceptors.response.use(
            (config) => config,
            async (error) => {
                // Si el error no tiene que ver con axios, reject
                if (!isAxiosError(error))
                    return Promise.reject(error);

                // _retry es una FLAG para trackear una request encolada
                const original = error.config as RetriableConfig | undefined;
                const status = error.status

                // No entramos al refresh si: no es 401, no hay config,
                // ya se reintentó, o el que falló es el propio refresh
                const dontRetry = (
                    status !== 401 || !original || original._retry || original.url?.includes(REFRESH_PATH)
                )
                if (dontRetry)
                    return Promise.reject(error);

                // Si llega acá, se marca la petición como reintentada
                original._retry = true
                try {
                    await refreshToken()
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
                return api(original);
            }
        )
    }
}
