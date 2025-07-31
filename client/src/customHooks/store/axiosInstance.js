import axios from "axios";

/*const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
})  */

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
}) 

export default axiosInstance;