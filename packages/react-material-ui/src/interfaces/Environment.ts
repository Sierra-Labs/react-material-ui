export interface Environment {
  apiBaseUrl: string;
  accessTokenKey: string;
  bearerPrefix: string;
  accessDeniedPath: string;
  expires?: number;
  secure?: boolean;
  domain?: string;
}
