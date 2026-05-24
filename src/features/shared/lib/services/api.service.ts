import type { Options as AxiosOptions } from 'redaxios';

import { config as appConfig } from '@/config';

const baseConfig: AxiosOptions = {
  headers: {
    Accept: 'application/json',
  },
};

type IAxiosError = {
  body: ReadableStream;
  ok: boolean;
  config: {
    headers: object;
  };
  data: unknown;
  status: number;
  statusText: string;
  type: string;
};

export class AxiosError extends Error {
  public ok: boolean;
  public data: unknown;
  public statusCode: number;

  public constructor(data: IAxiosError) {
    super('AxiosError');
    this.ok = data.ok;
    this.data = data.data;
    this.statusCode = data.status;
  }
}

export function isAxiosError(err: unknown): err is AxiosError {
  return err instanceof AxiosError;
}

/**
 * Extracts error message from API error response.
 * API errors follow this structure: { status: "error", message: "API error message detail" }
 * Returns the server-provided message if available, otherwise falls back to a generic message.
 */
export function extractApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const axiosError = error;
    const errorData = axiosError.data;
    // Check if error data matches API error contract: { status: "error", message: "..." }
    if (
      errorData !== null &&
      typeof errorData === 'object' &&
      'message' in errorData &&
      typeof errorData.message === 'string' &&
      errorData.message.trim().length > 0
    ) {
      return errorData.message;
    }
    // Fallback to status text if available
    if (axiosError.statusCode) {
      return `API request failed with status ${axiosError.statusCode}`;
    }
  }
  // Handle generic Error instances
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'An unknown error occurred';
}

// oxlint-disable-next-line unicorn/no-static-only-class
export class ApiService {
  public static async get<T>(url: string, config: AxiosOptions = baseConfig): Promise<T> {
    try {
      const response = await appConfig.get('axiosInstance').get<T>(url, config);
      return response.data;
    } catch (err) {
      throw new AxiosError(err as IAxiosError);
    }
  }

  public static async post<T>(
    url: string,
    data: Record<string, unknown> = {},
    config: AxiosOptions = baseConfig,
  ): Promise<T> {
    try {
      const response = await appConfig.get('axiosInstance').post<T>(url, data, config);
      return response.data;
    } catch (err) {
      throw new AxiosError(err as IAxiosError);
    }
  }

  public static async delete<T>(url: string, config: AxiosOptions = baseConfig): Promise<T> {
    try {
      const response = await appConfig.get('axiosInstance').delete<T>(url, config);
      return response.data;
    } catch (err) {
      throw new AxiosError(err as IAxiosError);
    }
  }

  public static async put<T>(
    url: string,
    data: Record<string, unknown> = {},
    config: AxiosOptions = baseConfig,
  ): Promise<T> {
    try {
      const response = await appConfig.get('axiosInstance').put<T>(url, data, config);
      return response.data;
    } catch (err) {
      throw new AxiosError(err as IAxiosError);
    }
  }

  public static async patch<T>(
    url: string,
    data: Record<string, unknown> = {},
    config: AxiosOptions = baseConfig,
  ): Promise<T> {
    try {
      const response = await appConfig.get('axiosInstance').patch<T>(url, data, config);
      return response.data;
    } catch (err) {
      throw new AxiosError(err as IAxiosError);
    }
  }
}
