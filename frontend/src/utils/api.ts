import { BASE_URL } from '../config/api';

/**
 * Custom request wrapper to talk to the EcoLens Express Backend
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ecolens_token');
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Do not set Content-Type header if sending FormData (Multer OCR uploads)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

const getCache: Record<string, Promise<any> | undefined> = {};

/**
 * Clears the internal GET request cache.
 */
export function clearApiCache(): void {
  for (const key in getCache) {
    delete getCache[key];
  }
}

const isTest = typeof globalThis !== 'undefined' && 
  (globalThis as any).process && 
  (globalThis as any).process.env && 
  (globalThis as any).process.env.NODE_ENV === 'test';

export const api = {
  get<T = any>(endpoint: string): Promise<T> {
    if (isTest) {
      return apiRequest<T>(endpoint, { method: 'GET' });
    }
    if (getCache[endpoint]) {
      return getCache[endpoint] as Promise<T>;
    }
    const responsePromise = apiRequest<T>(endpoint, { method: 'GET' });
    getCache[endpoint] = responsePromise;
    // Don't cache rejected promises
    responsePromise.catch(() => {
      delete getCache[endpoint];
    });
    return responsePromise;
  },
  post<T = any>(endpoint: string, body?: any): Promise<T> {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  put<T = any>(endpoint: string, body?: any): Promise<T> {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete<T = any>(endpoint: string): Promise<T> {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  }
};
