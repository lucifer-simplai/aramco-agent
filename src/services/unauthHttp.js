import axios from "axios";
import { X_DEVICE_ID } from "../constants";

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    request.headers[X_DEVICE_ID] = process.env.REACT_APP_DEVICE_ID;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
