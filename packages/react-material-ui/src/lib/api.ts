import Cookies from 'js-cookie';
import { Environment } from '../interfaces/Environment';

export enum FetchMethod {
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export interface FetchError {
  statusCode: number;
  error: string;
  message: string;
}

export interface FetchRequest {
  response: Promise<Response>;
  abort: () => void;
}

export interface ApiParams {
  [key: string]: any;
}

const api = {
  environment: {} as Environment,
  setEnvironment: (environment: Environment) => {
    api.environment = environment;
  },
  getBaseUrl: (): string => api.environment.apiBaseUrl,
  getAccessToken: (): string | undefined => {
    return Cookies.get(api.environment.accessTokenKey);
  },
  setAccessToken: (token: string) => {
    Cookies.set(api.environment.accessTokenKey, token, {
      expires: api.environment.expires || 365,
      domain: api.environment.domain || window.location.hostname,
      secure: api.environment.secure || false
    });
  },
  removeAccessToken: () =>
    Cookies.remove(api.environment.accessTokenKey, {
      domain: api.environment.domain || window.location.hostname
    }),
  get: (path: string, queryParams: ApiParams): FetchRequest => {
    return api.fetch(FetchMethod.Get, path, queryParams);
  },
  delete: (path: string, queryParams: ApiParams): FetchRequest => {
    return api.fetch(FetchMethod.Delete, path, queryParams);
  },
  patch: (path: string, body: ApiParams): FetchRequest => {
    return api.fetch(FetchMethod.Patch, path, body);
  },
  post: (path: string, body: ApiParams): FetchRequest => {
    return api.fetch(FetchMethod.Post, path, body);
  },
  put: (path: string, body: ApiParams): FetchRequest => {
    return api.fetch(FetchMethod.Put, path, body);
  },
  fetch: (
    method: FetchMethod,
    path: string,
    params: ApiParams = {}
  ): FetchRequest => {
    const controller = new AbortController();
    const { signal } = controller; // allow aborting the fetch call
    if (!api.environment.apiBaseUrl) {
      throw new Error(
        '`api.environment` not setup properly. Missing `apiBaseUrl`.'
      );
    }
    const url = new URL(path, api.environment.apiBaseUrl);
    // console.log('url', url);
    const headers = {
      [api.environment.accessTokenKey]: `Bearer ${api.getAccessToken()}`
    } as any;
    const options: RequestInit = {
      headers,
      method,
      signal
    };
    switch (method) {
      case FetchMethod.Get:
      case FetchMethod.Delete:
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(
            key,
            typeof value === 'object' ? JSON.stringify(value) : value
          );
        });
        break;
      case FetchMethod.Patch:
      case FetchMethod.Post:
      case FetchMethod.Put:
        (options.headers as any)['content-type'] = 'application/json';
        options.body = JSON.stringify(params);
        break;
    }
    return {
      response: fetch(url.toString(), options),
      abort: controller.abort.bind(controller)
    };
  }
};

export default api;
