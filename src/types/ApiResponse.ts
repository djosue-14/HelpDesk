import type { AxiosError } from 'axios'

export interface ApiResponse<T> {
  data: T | null
  success: boolean
  message: string | null
  statusCode: number | null
}

export function wrapResponse<T>(data: T, statusCode = 200): ApiResponse<T> {
  return { data, success: true, message: null, statusCode }
}

export function wrapError<T>(error: unknown): ApiResponse<T> {
  const axiosError = error as AxiosError
  return {
    data: null,
    success: false,
    message: (axiosError.response?.data as { detail?: string })?.detail
      ?? axiosError.message
      ?? 'Error desconocido',
    statusCode: axiosError.response?.status ?? null,
  }
}
