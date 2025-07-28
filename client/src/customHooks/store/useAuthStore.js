import { create } from "zustand";
import axiosInstance from "../../utils/axiosInstance.js";

async function loginUser(data, set) {
    const response = await axiosInstance.post("/auth", data);
    const accessToken = response.data.accessToken;
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const userId = payload.userId;

    set({accessToken, userId})
}

async function refreshToken(set) {
    try {
        const response = await axiosInstance.get("/refresh");
        const accessToken = response.data.accessToken; 
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const userId = payload.userId;
        
        set({accessToken, userId, hasTriedRefresh: true});
        return true;
    } catch {
        set({ accessToken: null, userId: null, hasTriedRefresh: true})
        return false; 
    }    
}

async function logoutUser(set) {
    await axiosInstance.get("/logout");
    set({accessToken: null, userId: null, hasTriedRefresh: true});
}

function configureAuthStore(set) {
    return {
        accessToken: null, 
        userId: null, 
        hasTriedRefresh: false,

        setAccessToken: (accessToken) => set({accessToken}),
        setUserId: (userId) => set({userId}),

        login: (data) => loginUser(data, set),
        refresh: () => refreshToken(set),
        logout: () => logoutUser(set)
    }
}

const useAuthStore = create(configureAuthStore);

export default useAuthStore;
