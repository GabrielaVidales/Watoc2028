import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || ''

const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Los interceptors son ideales para manejar en automático el cargado de los
// access y refresh token al hacer una llamada a la api
// axiosClient.interceptors.request.use(
//     (config) => {
//         return config
//     },
// )

export default axiosClient