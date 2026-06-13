import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export interface UseApiOptions {
  immediate?: boolean;
}

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Custom hook for managing API GET requests with state tracking.
 */
export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions = { immediate: true }
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!options.immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<T>(endpoint);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (options.immediate) {
      execute().catch(() => {});
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute, setData };
}
