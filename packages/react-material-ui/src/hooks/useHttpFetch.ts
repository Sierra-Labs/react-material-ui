import { useCallback, useRef, useState } from 'react';
import api, { FetchError } from '../lib/api';

enum FetchMethod {
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

interface ApiParams {
  [key: string]: any;
}

/**
 * Raw HTTP fetch hook.
 * @param baseUrl
 * @param options
 * @returns
 */
export function useHttpFetch(baseUrl?: string, options?: RequestInit) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError>();
  const hookOptionsRef = useRef(options || {});
  hookOptionsRef.current = options || {};
  const performFetchUrl = useCallback(
    async (method: FetchMethod, url: URL, options?: RequestInit) => {
      setLoading(true);
      if (!options) options = {};
      options.method = method;
      try {
        const result = await fetch(url.toString(), {
          ...hookOptionsRef.current,
          ...options
        });
        setLoading(false);
        return result;
      } catch (error) {
        setLoading(false);
        setError(error as FetchError);
        throw error;
      }
    },
    []
  );
  const performFetch = useCallback(
    async (method: FetchMethod, path: string, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      return performFetchUrl(method, url, options);
    },
    [baseUrl, performFetchUrl]
  );
  const get = useCallback(
    async (path: string, options?: RequestInit) => {
      return performFetch(FetchMethod.Get, path, options);
    },
    [performFetch]
  );
  const del = useCallback(
    async (path: string, options?: RequestInit) => {
      return performFetch(FetchMethod.Delete, path, options);
    },
    [performFetch]
  );
  const patch = useCallback(
    async (path: string, options?: RequestInit) => {
      return performFetch(FetchMethod.Patch, path, options);
    },
    [performFetch]
  );
  const post = useCallback(
    async (path: string, options?: RequestInit) => {
      return performFetch(FetchMethod.Post, path, options);
    },
    [performFetch]
  );
  const put = useCallback(
    async (path: string, options?: RequestInit) => {
      return performFetch(FetchMethod.Put, path, options);
    },
    [performFetch]
  );
  return {
    loading,
    error,
    performFetchUrl,
    performFetch,
    setError,
    get,
    del,
    patch,
    post,
    put
  };
}

/**
 * HTTP fetch hook for API calls and JSON parser methods.
 * @param baseUrl
 * @param options
 * @returns
 */
export function useHttpFetchApi(baseUrl?: string, options?: RequestInit) {
  if (!baseUrl) baseUrl = api.environment.apiBaseUrl;
  if (!baseUrl) {
    throw new Error(
      '`api.environment` not setup properly. Missing `apiBaseUrl`.'
    );
  }
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  const headers = options.headers as any;
  if (!headers['content-type']) headers['content-type'] = 'application/json';
  if (!headers[api.environment.accessTokenKey])
    headers[api.environment.accessTokenKey] = `Bearer ${api.getAccessToken()}`;

  const { performFetchUrl, setError, ...httpFetchApi } = useHttpFetch(
    baseUrl,
    options
  );
  const [loading, setLoading] = useState(false);
  const performFetchUrlJson = useCallback(
    async <T>(method: FetchMethod, url: URL, options?: RequestInit) => {
      setLoading(true);
      const result = await performFetchUrl(method, url, options);
      let json = result ? await result.json() : undefined;
      if (!result.ok) {
        setError(json);
        setLoading(false);
        return;
      }
      if (json) json = parseDateFields(json);
      setLoading(false);
      return json as T;
    },
    [performFetchUrl, setError]
  );
  const getJson = useCallback(
    async <T>(path: string, params?: ApiParams, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      appendAsQueryString(url, params);
      return performFetchUrlJson<T>(FetchMethod.Get, url, options);
    },
    [baseUrl, performFetchUrlJson]
  );
  const deleteJson = useCallback(
    async <T>(path: string, params?: ApiParams, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      appendAsQueryString(url, params);
      return performFetchUrlJson<T>(FetchMethod.Delete, url, options);
    },
    [baseUrl, performFetchUrlJson]
  );
  const patchJson = useCallback(
    async <T>(path: string, params?: ApiParams, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      if (!options) options = {};
      options.body = JSON.stringify(params);
      return performFetchUrlJson<T>(FetchMethod.Patch, url, options);
    },
    [baseUrl, performFetchUrlJson]
  );
  const postJson = useCallback(
    async <T>(path: string, params?: ApiParams, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      if (!options) options = {};
      options.body = JSON.stringify(params);
      return performFetchUrlJson<T>(FetchMethod.Post, url, options);
    },
    [baseUrl, performFetchUrlJson]
  );
  const putJson = useCallback(
    async <T>(path: string, params?: ApiParams, options?: RequestInit) => {
      const url = new URL(path, baseUrl);
      if (!options) options = {};
      options.body = JSON.stringify(params);
      return performFetchUrlJson<T>(FetchMethod.Put, url, options);
    },
    [baseUrl, performFetchUrlJson]
  );

  return {
    ...httpFetchApi,
    loading,
    performFetchUrl,
    performFetchUrlJson,
    getJson,
    deleteJson,
    patchJson,
    postJson,
    putJson
  };
}

function appendAsQueryString(url: URL, params?: ApiParams) {
  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === 'undefined') return; // skip undefined
    url.searchParams.set(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    );
  });
}

const DATE_STRING_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
/**
 * Recursively checks the response json object for Date properties in string format and parses them to native JS Date type
 * @param json
 */
function parseDateFields(json: any): any {
  if (json === null || json === undefined) {
    return json;
  }
  if (Array.isArray(json)) {
    return json.map(item => parseDateFields(item));
  }
  if (typeof json === 'object') {
    let newJson: { [key: string]: any } = {};
    Object.keys(json).forEach((key: string) => {
      newJson[key] = parseDateFields(json[key]);
    });
    return newJson;
  }
  if (typeof json === 'string' && DATE_STRING_REGEX.test(json)) {
    return new Date(json);
  }
  return json;
}
