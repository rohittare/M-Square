import axios, { AxiosHeaders } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER ?? "",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("access_token");
        console.log("Token" , token);
        
        const tokenType = sessionStorage.getItem("token_type") ?? "Bearer";
        if (token) {
            const headers = AxiosHeaders.from(config.headers);
            headers.set("Authorization", `${tokenType} ${token}`);
            config.headers = headers;
        }
    }
    return config;
});

export default api;
