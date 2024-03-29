export interface JwtPayload {
  userId: string;
}

export type ErrorStruct = {
  param?: string;
  message: string;
  code: string;
};

type NormalData = Record<string, unknown>;
type PaginatedData = Record<string, unknown>[];
type Data = NormalData | PaginatedData;

type TokenProperty = {
  access_token: string;
};
type PaginationProperty = {
  page: number;
  pages: number;
  total: number;
};
type MetaProperties = TokenProperty | PaginationProperty;

export type ContentType = {
  data: Data;
  meta?: MetaProperties;
};
