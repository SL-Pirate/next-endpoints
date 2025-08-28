// noinspection JSUnusedGlobalSymbols

import { useEffect, useState } from "react";

interface ITypeWithArgs<I, T> {
  call: (args: I, headers: Record<string, string>) => Promise<T>;
  args: I;
  deps: any[];
  headers?: Record<string, string>;
}

interface ITypeWithoutArgs<T> {
  call: (headers: Record<string, string>) => Promise<T>;
  deps: any[];
  headers?: Record<string, string>;
}

interface IReturnType<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useApiClient<I, T>(props: ITypeWithArgs<I, T>): IReturnType<T>;
export function useApiClient<I, T>(props: ITypeWithoutArgs<T>): IReturnType<T>;

/**
 * useApiClient
 *
 * A generic React hook for calling an API client function with automatic
 * loading, error, and data state management. Handles race conditions
 * and prevents updating state on unmounted components.
 *
 * @template I - Type of the arguments passed to the API client function
 * @template T - Type of the data returned by the API client function
 *
 * @param {Object} props - Configuration object
 * @param {(args: I, headers: Record<string, string>) => Promise<T>} props.call
 *   The API client function to call. Must return a Promise.
 * @param {I} props.args
 *   Arguments to pass to the API client function.
 * @param {any[]} props.deps
 *   Dependency array. The hook will re-run the request whenever these change.
 * @param {Record<string, string>} [props.headers]
 *   Optional request headers (e.g., authentication tokens).
 *
 * @returns {{
 *   data: T | null,
 *   error: Error | null,
 *   loading: boolean
 * }}
 *   - `data`: The resolved response from the API call (or `null` if not loaded/error).
 *   - `error`: The error if the request failed (always normalized to `Error`), or `null`.
 *   - `loading`: True while the request is in progress, false otherwise.
 *
 * @example
 * const { data, error, loading } = useApiClient({
 *   call: api.getUser,
 *   args: userId,
 *   deps: [userId],
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export function useApiClient<I, T>(
  props: ITypeWithArgs<I, T> | ITypeWithoutArgs<T>,
): {
  data: T | null;
  error: Error | null;
  loading: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false; // prevent race conditions + unmounted state updates
    setLoading(true);

    let res: Promise<T>;
    if ("args" in props) {
      res = props.call(props.args, props.headers ?? {});
    } else {
      res = props.call(props.headers ?? {});
    }

    res
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, props.deps); // don’t spread, let caller control stability

  return { data, error, loading };
}
