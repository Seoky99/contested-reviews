import axios from 'axios'; 
import useAuthStore from "./useAuthStore";

const axiosPrivate = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
})

//The first try: No authorization headers: so set the headers to Bearer 
//With the stored token 
axiosPrivate.interceptors.request.use( 
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config; 
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 
            const refreshed = await useAuthStore.getState().refresh(); 
            if (refreshed) {
                const newToken = useAuthStore.getState().accessToken; 
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axiosPrivate(originalRequest);
            }

            //could logout on failed request
        }

        return Promise.reject(error);
    }
);

export default axiosPrivate; 