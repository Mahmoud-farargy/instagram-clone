import axios from "axios";
import { audioscrobbler, lyricsOvh } from "./app-config.json";

const API = (urlBaseType) => {
    const axiosInstance = axios.create({
        baseURL: urlBaseType === "lyricsovh" ? lyricsOvh : audioscrobbler,
        headers: {
            Accept: "application/json",
            "Content-Type": "application.json"
        }
    })
    axios.defaults.timeout = 10000;
    axiosInstance.interceptors.request.use(request => {
        return request;
    }, err => {
        return Promise.reject(err);
    })
    return axiosInstance;
}

export default API;