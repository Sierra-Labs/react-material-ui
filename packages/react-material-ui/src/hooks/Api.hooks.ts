import { useState, useEffect, useCallback, useReducer } from 'react';
import api, {
  FetchRequest,
  FetchError,
  ApiParams,
  FetchMethod
} from '../lib/api';

export interface ApiResult<T> {
  data?: T;
  isLoading: boolean;
  response?: Response;
  error?: FetchError;
}

export type FetchApiCallback = (params?: ApiParams) => void;

export interface ApiFetchResult<T> extends ApiResult<T> {
  fetchApi: FetchApiCallback;
}

export interface ApiGetResult<T> extends ApiResult<T> {
  get: FetchApiCallback;
}

export interface ApiPatchResult<T> extends ApiResult<T> {
  patch: FetchApiCallback;
}

export interface ApiPostResult<T> extends ApiResult<T> {
  post: FetchApiCallback;
}

export interface ApiPutResult<T> extends ApiResult<T> {
  put: FetchApiCallback;
}

export interface ApiDeleteResult<T> extends ApiResult<T> {
  del: FetchApiCallback;
}

export function useApiGet<T>(path: string): ApiGetResult<T> {
  const { fetchApi, ...params } = useApiFetch<T>(FetchMethod.Get, path);
  return { ...params, get: fetchApi };
}

export function useApiPatch<T>(path: string): ApiPatchResult<T> {
  const { fetchApi, ...params } = useApiFetch<T>(FetchMethod.Patch, path);
  return { ...params, patch: fetchApi };
}

export function useApiPost<T>(path: string): ApiPostResult<T> {
  const { fetchApi, ...params } = useApiFetch<T>(FetchMethod.Post, path);
  return { ...params, post: fetchApi };
}

export function useApiPut<T>(path: string): ApiPutResult<T> {
  const { fetchApi, ...params } = useApiFetch<T>(FetchMethod.Put, path);
  return { ...params, put: fetchApi };
}

export function useApiDelete<T>(path: string): ApiDeleteResult<T> {
  const { fetchApi, ...params } = useApiFetch<T>(FetchMethod.Delete, path);
  return { ...params, del: fetchApi };
}

enum FetchActions {
  Init,
  Success,
  Failure
}

function fetchReducer<T>(
  state: ApiResult<T>,
  action: { type: FetchActions; payload?: T | FetchError }
): ApiResult<T> {
  switch (action.type) {
    case FetchActions.Init:
      return { ...state, isLoading: true, error: undefined };
    case FetchActions.Success:
      return { ...state, isLoading: false, data: action.payload as T };
    case FetchActions.Failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload as FetchError
      };
    default:
      throw new Error('Unrecognized action');
  }
}

export function useApiFetch<T>(
  method: FetchMethod,
  path: string
): ApiFetchResult<T> {
  const [response, setResponse] = useState<Response>();
  const [request, setRequest] = useState<FetchRequest>();
  const [state, dispatch] = useReducer(fetchReducer, { isLoading: false });

  useEffect(() => {
    if (request) {
      const processRequest = async () => {
        dispatch({ type: FetchActions.Init });
        try {
          const result = await request.response;
          const json = await result.json();
          setResponse(result);
          if (result.ok) {
            dispatch({
              type: FetchActions.Success,
              payload: parseDateFields(json)
            });
          } else {
            dispatch({ type: FetchActions.Failure, payload: json });
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            // ignore when request is aborted
            dispatch({ type: FetchActions.Failure, payload: error });
          }
        }
      };
      processRequest();
      // return request.abort; // NOTE: This causes data loss; TODO: rework abort logic
    }
  }, [request]);
  const fetchApi = useCallback(
    (params: ApiParams = {}) => {
      setResponse(undefined);
      setRequest(api.fetch(method, path, params));
    },
    [setRequest, method, path]
  );
  return {
    data: state.data as T,
    isLoading: state.isLoading,
    response,
    error: state.error,
    fetchApi
  };
}

const DATE_STRING_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
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
