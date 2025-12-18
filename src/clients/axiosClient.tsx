import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL
console.log(BASE_URL);


const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosClient.interceptors.request.use(
    (config) => {
        console.log('Intercepted');
        return config
    },
)

export default axiosClient