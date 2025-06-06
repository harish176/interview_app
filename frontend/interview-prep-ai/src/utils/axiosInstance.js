import axios from 'axios';
// import {BASE_URL} from "./apiPaths.js"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axionsInstance = axios.create({
    baseURL:BASE_URL,
    timeout:80000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

axionsInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.respomse){
            if(error.response.status===401){
                window.location.href="/";
            }else if(error.response.status===500){
                console.error("Server error. Please try again later");
            }
        }else if(error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again");
        }
        return Promise.reject(error);
    }
);

export default axionsInstance;