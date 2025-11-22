import axiosInstance from "./axios-instance";
import axios from "axios";

const setupInterceptors = (apiClient: Axios.AxiosInstance) => {
  apiClient.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

export async function initAxios(axiosInstance: Axios.AxiosInstance) {
  setupInterceptors(axiosInstance);
}
