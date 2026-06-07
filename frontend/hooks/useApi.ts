// src/hooks/useApi.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
  options: { immediate?: boolean } = { immediate: true },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!options.immediate);
  const [error, setError] = useState<{ code?: string; message: string } | null>(null);

  const mounted = useRef(true);
  useEffect(() => () => void (mounted.current = false), []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mounted.current) setData(result);
      return result;
    } catch (e: any) {
      if (mounted.current) setError(e);
      throw e;
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (options.immediate) run().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, run, setData };
}