import axios, { type Options as AxiosOptions } from 'redaxios';
import { describe, it, expect, beforeEach, vi } from 'vite-plus/test';

import { config } from '@/config';

import { ApiService, AxiosError } from './api.service';

// Mock redaxios
vi.mock('redaxios', () => {
  const mockAxiosInstance = {
    get: vi.fn<() => void>(),
    post: vi.fn<() => void>(),
    delete: vi.fn<() => void>(),
    put: vi.fn<() => void>(),
    patch: vi.fn<() => void>(),
  };

  const mockAxios = {
    create: vi.fn<() => typeof mockAxiosInstance>(() => mockAxiosInstance),
    get: vi.fn<() => void>(),
    post: vi.fn<() => void>(),
    delete: vi.fn<() => void>(),
    put: vi.fn<() => void>(),
    patch: vi.fn<() => void>(),
  };

  return {
    default: mockAxios,
  };
});

describe('ApiService', () => {
  // oxlint-disable-next-line no-explicit-any
  let mockAxiosInstance: any;
  const defaultConfig = {
    headers: {
      Accept: 'application/json',
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Create a fresh mock axios instance
    mockAxiosInstance = {
      get: vi.fn<() => void>(),
      post: vi.fn<() => void>(),
      delete: vi.fn<() => void>(),
      put: vi.fn<() => void>(),
      patch: vi.fn<() => void>(),
    };

    // Reset ApiService to use the mock instance
    config.set('axiosInstance', mockAxiosInstance);
  });

  describe('setOptions', () => {
    it('should update options with provided values', async () => {
      const customInstance = {
        get: vi.fn<() => Promise<unknown>>(),
        post: vi.fn<() => Promise<unknown>>(),
        delete: vi.fn<() => Promise<unknown>>(),
        put: vi.fn<() => Promise<unknown>>(),
        patch: vi.fn<() => Promise<unknown>>(),
      };

      config.set('axiosInstance', customInstance as unknown as ReturnType<typeof axios.create>);

      // Verify the instance is updated by making a call
      customInstance.get.mockResolvedValueOnce({
        data: {
          test: true,
        },
      });
      await ApiService.get('/test');

      expect(customInstance.get).toHaveBeenCalledWith('/test', defaultConfig);
    });

    it('should partially update options', async () => {
      const customInstance = {
        get: vi.fn<() => Promise<unknown>>(),
        post: vi.fn<() => Promise<unknown>>(),
        delete: vi.fn<() => Promise<unknown>>(),
        put: vi.fn<() => Promise<unknown>>(),
        patch: vi.fn<() => Promise<unknown>>(),
      };

      config.set('axiosInstance', customInstance as unknown as ReturnType<typeof axios.create>);

      customInstance.get.mockResolvedValueOnce({
        data: {
          test: true,
        },
      });
      await ApiService.get('/test');

      expect(customInstance.get).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should make a GET request and return data', async () => {
      const mockData = {
        id: 1,
        name: 'Test',
      };
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.get('/users/1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a GET request with custom config', async () => {
      const mockData = {
        id: 1,
        name: 'Test',
      };
      const customConfig = {
        headers: {
          'X-Custom': 'value',
        },
      };
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.get('/users/1', customConfig);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', customConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle GET request errors', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(ApiService.get('/users/1')).rejects.toBeInstanceOf(AxiosError);
    });
  });

  describe('post', () => {
    it('should make a POST request and return data', async () => {
      const mockData = {
        id: 1,
        name: 'Created',
      };
      const postData = {
        name: 'New User',
      };
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.post('/users', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a POST request without data', async () => {
      const mockData = {
        success: true,
      };
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.post('/action');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/action', {}, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a POST request with custom config', async () => {
      const mockData = {
        id: 1,
      };
      const postData = {
        name: 'Test',
      };
      const customConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.post('/users', postData, customConfig);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, customConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle POST request errors', async () => {
      const error = new Error('Validation error');
      mockAxiosInstance.post.mockRejectedValueOnce(error);

      await expect(
        ApiService.post('/users', {
          name: '',
        }),
      ).rejects.toBeInstanceOf(AxiosError);
    });
  });

  describe('delete', () => {
    it('should make a DELETE request and return data', async () => {
      const mockData = {
        success: true,
      };
      mockAxiosInstance.delete.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.delete('/users/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a DELETE request with custom config', async () => {
      const mockData = {
        deleted: true,
      };
      const customConfig = {
        headers: {
          'X-Auth': 'token',
        },
      };
      mockAxiosInstance.delete.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.delete('/users/1', customConfig);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', customConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle DELETE request errors', async () => {
      const error = new Error('Not found');
      mockAxiosInstance.delete.mockRejectedValueOnce(error);

      await expect(ApiService.delete('/users/999')).rejects.toBeInstanceOf(AxiosError);
    });
  });

  describe('put', () => {
    it('should make a PUT request and return data', async () => {
      const mockData = {
        id: 1,
        name: 'Updated',
      };
      const putData = {
        name: 'Updated User',
      };
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.put('/users/1', putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', putData, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a PUT request without data', async () => {
      const mockData = {
        updated: true,
      };
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.put('/users/1');

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', {}, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a PUT request with custom config', async () => {
      const mockData = {
        id: 1,
      };
      const putData = {
        name: 'Test',
      };
      const customConfig = {
        timeout: 5000,
      };
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.put('/users/1', putData, customConfig as AxiosOptions);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', putData, customConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle PUT request errors', async () => {
      const error = new Error('Update failed');
      mockAxiosInstance.put.mockRejectedValueOnce(error);

      await expect(
        ApiService.put('/users/1', {
          name: 'Test',
        }),
      ).rejects.toBeInstanceOf(AxiosError);
    });
  });

  describe('patch', () => {
    it('should make a PATCH request and return data', async () => {
      const mockData = {
        id: 1,
        status: 'active',
      };
      const patchData = {
        status: 'active',
      };
      mockAxiosInstance.patch.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.patch('/users/1', patchData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a PATCH request without data', async () => {
      const mockData = {
        patched: true,
      };
      mockAxiosInstance.patch.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.patch('/users/1');

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', {}, defaultConfig);
      expect(result).toEqual(mockData);
    });

    it('should make a PATCH request with custom config', async () => {
      const mockData = {
        id: 1,
      };
      const patchData = {
        status: 'inactive',
      };
      const customConfig = {
        validateStatus: (status: number): boolean => status < 500,
      };
      mockAxiosInstance.patch.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ApiService.patch('/users/1', patchData, customConfig);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, customConfig);
      expect(result).toEqual(mockData);
    });

    it('should handle PATCH request errors', async () => {
      const error = new Error('Patch failed');
      mockAxiosInstance.patch.mockRejectedValueOnce(error);

      await expect(
        ApiService.patch('/users/1', {
          status: 'test',
        }),
      ).rejects.toBeInstanceOf(AxiosError);
    });
  });

  describe('Type Safety', () => {
    it('should return correctly typed data from GET', async () => {
      interface User {
        id: number;
        name: string;
      }
      const mockUser: User = {
        id: 1,
        name: 'Test',
      };
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockUser,
      });

      const result = await ApiService.get<User>('/users/1');

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test');
    });

    it('should return correctly typed data from POST', async () => {
      interface CreateResponse {
        success: boolean;
        id: number;
      }
      const mockResponse: CreateResponse = {
        success: true,
        id: 123,
      };
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await ApiService.post<CreateResponse>('/users', {
        name: 'New',
      });

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.id).toBe(123);
    });
  });
});
