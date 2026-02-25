/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "@tanstack/react-router";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO LATER
function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  data?: unknown;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 500,
      message:
        (error.response?.data as any)?.message ??
        error.message ??
        "Request failed",
      code: (error.response?.data as any)?.code,
      data: error.response?.data,
    };
    if (apiError.status === 404) {
      throw notFound();
    }

    if (apiError.status === 401) {
      //   TODO LATER
    }

    return Promise.reject(apiError);
  },
);

export async function get<T>(
  url: string,
  config?: InternalAxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: InternalAxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(url, body, config);
  return response.data;
}

export async function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: InternalAxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.put<T>(url, body, config);
  return response.data;
}

export async function del<T>(
  url: string,
  config?: InternalAxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
