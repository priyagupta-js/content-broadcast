import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic async hook — handles loading / success / error states.
 * @param {Function} asyncFn  — the async function to call
 * @param {Array}    deps     — dependency array; re-fetches when these change
 * @param {boolean}  immediate — whether to call on mount (default true)
 */
export function useAsync(asyncFn, deps = [], immediate = true) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      if (mountedRef.current) { setData(result); setLoading(false); }
      return result;
    } catch (err) {
      if (mountedRef.current) { setError(err.message); setLoading(false); }
      throw err;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch, execute };
}
