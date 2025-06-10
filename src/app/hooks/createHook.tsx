import { useState, useEffect, useCallback, useRef } from 'react';

const cache = new Map<string, any>();

interface HookOptions {
  method?: string;
}

interface ApiParams {
  [key: string]: string | number;
}

function replaceParams(url: string, params: ApiParams): string {
  return url.replace(/:([a-zA-Z]+)/g, (_, key: string) => String(params[key]));
}

export function createHook(baseUrl: string, options: HookOptions = {}) {
  return function useApi(params: ApiParams = {}, body: any = null, manual: boolean = false) {
    const url = replaceParams(baseUrl, params);
    const method = options.method || 'GET';

    const cacheKey = method + url + JSON.stringify(body || {});
    const isGet = method === 'GET';

    const [data, setData] = useState<any>(() => isGet && cache.has(cacheKey) ? cache.get(cacheKey) : null);
    const [loading, setLoading] = useState<boolean>(!manual);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: method !== 'GET' && body ? JSON.stringify(body) : null,
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);

        if (isGet) cache.set(cacheKey, json);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }, [url, body]);

    useEffect(() => {
      if (!manual) fetchData();
      return () => abortRef.current?.abort();
    }, [fetchData, manual]);

    return { data, loading, error, refetch: fetchData };
  };
}
