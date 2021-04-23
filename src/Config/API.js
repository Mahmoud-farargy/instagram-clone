import axios from "axios";
import {baseUrl} from "./app-config.json";

const API = () => {
    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
            Accept: "application/json",
            "Content-Type": "application.json"
        }
    })
    axios.defaults.timeout = 10000;
    axiosInstance.interceptors.request.use( request => {
        return request;
    },err => {
        return Promise.reject(err);
    })
    return axiosInstance
}

export default API;