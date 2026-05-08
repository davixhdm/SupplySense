import { useState, useEffect, useCallback, useRef } from 'react';
export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(!!url);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const fetchData = useCallback(async () => {
        if (!url) {
            setIsLoading(false);
            return;
        }
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        setError(null);
        try {
            const { baseUrl = '', timeout = 5000, ...fetchOptions } = options;
            const controller = abortControllerRef.current;
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(`${baseUrl}${url}`, {
                ...fetchOptions,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
        }
        catch (err) {
            if (err instanceof Error) {
                // Ignore abort errors (user canceled)
                if (err.name !== 'AbortError') {
                    setError(err);
                }
            }
            else {
                setError(new Error('An unknown error occurred'));
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [url, options]);
    useEffect(() => {
        fetchData();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [url, fetchData]);
    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);
    return { data, isLoading, error, refetch };
};
// Helper function for POST, PUT, DELETE requests
export const useFetchMutation = (baseUrl = '') => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const mutate = useCallback(async (url, method = 'POST', payload, options = {}) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        setError(null);
        try {
            const { timeout = 5000, ...fetchOptions } = options;
            const controller = abortControllerRef.current;
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(`${baseUrl}${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOptions.headers,
                },
                body: payload ? JSON.stringify(payload) : undefined,
                signal: controller.signal,
                ...fetchOptions,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch (err) {
            if (err instanceof Error) {
                if (err.name !== 'AbortError') {
                    setError(err);
                }
            }
            else {
                setError(new Error('An unknown error occurred'));
            }
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [baseUrl]);
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);
    return { mutate, isLoading, error, cancel };
};
