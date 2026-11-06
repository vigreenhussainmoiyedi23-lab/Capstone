import axios from "axios";
import { store } from "./store.js";

const api = axios.create({
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Retrieve and set your bearer token
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;
