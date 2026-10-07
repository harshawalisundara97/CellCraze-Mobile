"use client";

import { useEffect, useState } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string | null): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: url !== null,
    error: null,
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
        return (await res.json()) as T;
      })
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Request failed",
          });
      });

    return () => {
      active = false;
    };
  }, [url, nonce]);

  // Refetch when the user returns to the tab/page, so a view restored from the
  // browser or router cache shows current data instead of a stale snapshot.
  useEffect(() => {
    if (!url) return;
    const refetch = () => {
      if (document.visibilityState === "visible") setNonce((n) => n + 1);
    };
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", refetch);
    return () => {
      window.removeEventListener("focus", refetch);
      document.removeEventListener("visibilitychange", refetch);
    };
  }, [url]);

  return { ...state, refetch: () => setNonce((n) => n + 1) };
}
