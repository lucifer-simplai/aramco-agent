import axios from "axios";
import {
  A_ID,
  PIM_SID,
  X_CLIENT_ID,
  X_DEVICE_ID,
  X_PROFILE_ID,
  X_PROFILE_NAME,
  X_PROJECT_ID,
  X_SELLER_ID,
  X_SELLER_PROFILE_ID,
  X_TENANT_ID,
  X_USER_ID,
} from "../constants";
import { useAppStore } from "../store";
// Now you can use this store anywhere in your app

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  async (request) => {
    const { userSessionConfig } = useAppStore.getState();
    const DefaultHeaders = {
      [X_USER_ID]: request?.headers?.[X_USER_ID] ?? userSessionConfig?.userId,
      [X_TENANT_ID]:
        request?.headers?.[X_TENANT_ID] ?? userSessionConfig?.TENANT_ID,
      [PIM_SID]: request?.headers?.[PIM_SID] ?? userSessionConfig?.PIM_SID,
      [A_ID]: request?.headers?.[A_ID] ?? userSessionConfig?.A_ID,
      [X_DEVICE_ID]: process.env.REACT_APP_DEVICE_ID,
      [X_CLIENT_ID]:
        request?.headers?.[X_CLIENT_ID] ?? userSessionConfig?.userId,
      [X_SELLER_ID]:
        request?.headers?.[X_SELLER_ID] ?? userSessionConfig?.userId,
      [X_SELLER_PROFILE_ID]:
        request?.headers?.[X_SELLER_PROFILE_ID] ?? userSessionConfig?.userId,
      [X_PROFILE_ID]:
        request?.headers?.[X_PROFILE_ID] ?? userSessionConfig?.GUEST_USER_ID,
      [X_PROFILE_NAME]:
        request?.headers?.[X_PROFILE_NAME] ??
        userSessionConfig?.GUEST_USER_NAME,
      [X_PROJECT_ID]:
        request?.headers?.[X_PROJECT_ID] ??
        userSessionConfig?.PROJECT_ID ??
        request?.headers?.[X_TENANT_ID] ??
        userSessionConfig?.TENANT_ID,
    };

    request.headers = { ...(request.headers || {}), ...DefaultHeaders };

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof response?.data?.ok === "boolean") {
      if (response.data?.ok) {
        return response;
      } else {
        return Promise.reject(response);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    //This means that session token has expired and need to generate new access token using create session api
    if (error?.response?.status === 511) {
      // update state PIM_SID
    }

    return Promise.reject(error);
  },
);

export const axiosInstanceWithoutWarehouse = axios.create();

export default axiosInstance;
