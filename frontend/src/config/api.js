/**
 * Reusable API base URL configuration.
 * Automatically appends '/api' if not present in the environment variable.
 */
let apiBaseUrl = import.meta.env.VITE_API_URL || 'https://carbon-footprint-dl81.onrender.com/api';

if (apiBaseUrl && !apiBaseUrl.endsWith('/api')) {
  apiBaseUrl = `${apiBaseUrl.replace(/\/$/, '')}/api`;
}

export const BASE_URL = apiBaseUrl;
