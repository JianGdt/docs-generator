import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ENV } from "../constants";
import { ApiError, ApiResponse } from "../@types/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.APP_URL,
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["X-Request-Time"] = new Date().toISOString();
    if (ENV.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    if (ENV.NODE_ENV === "development") {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || "An error occurred",
        code: error.response.data?.code,
        status: error.response.status,
        details: error.response.data?.details,
      };
      switch (error.response.status) {
        case 401:
          // Unauthorized
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          apiError.message =
            "You do not have permission to perform this action.";
          break;
        case 429:
          // Rate limited
          apiError.message = "Too many requests. Please try again later.";
          break;
        case 500:
          // Server error
          apiError.message = "Server error. Please try again later.";
          break;
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      const networkError: ApiError = {
        message: "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
      };
      console.error("[Network Error]", error.request);
      return Promise.reject(networkError);
    } else {
      const unknownError: ApiError = {
        message: error.message || "An unknown error occurred",
        code: "UNKNOWN_ERROR",
      };
      console.error("[Unknown Error]", error);
      return Promise.reject(unknownError);
    }
  },
);

export async function apiRequest<T = any>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<T>(config);
    return {
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error as ApiError,
      timestamp: new Date().toISOString(),
    };
  }
}

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "GET", url }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "POST", url, data }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PUT", url, data }),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PATCH", url, data }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "DELETE", url }),
};

export default apiClient;
