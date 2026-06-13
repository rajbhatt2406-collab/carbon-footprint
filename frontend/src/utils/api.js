import { BASE_URL } from '../config/api';

/**
 * Custom request wrapper to talk to the EcoLens Express Backend
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('ecolens_token');
  
  const headers = {
    ...options.headers,
  };

  // Do not set Content-Type header if sending FormData (Multer OCR uploads)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
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

const getCache = {};

/**
 * Clears the internal GET request cache.
 */
export function clearApiCache() {
  for (const key in getCache) {
    delete getCache[key];
  }
}

const isTest = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';

export const api = {
  get(endpoint) {
    if (isTest) {
      return apiRequest(endpoint, { method: 'GET' });
    }
    if (getCache[endpoint]) {
      return getCache[endpoint];
    }
    const responsePromise = apiRequest(endpoint, { method: 'GET' });
    getCache[endpoint] = responsePromise;
    // Don't cache rejected promises
    responsePromise.catch(() => {
      delete getCache[endpoint];
    });
    return responsePromise;
  },
  post(endpoint, body) {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  put(endpoint, body) {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete(endpoint) {
    if (!isTest) {
      clearApiCache();
    }
    return apiRequest(endpoint, { method: 'DELETE' });
  }
};

