/* eslint-disable @typescript-eslint/no-explicit-any */

import type { HttpMethod } from "@/constants/api";
import type { ApiError } from "@/core/api/ApiError";
import type {
  DataTag,
  MutationKey,
  QueryKey,
  UnusedSkipTokenOptions,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export type JSONPrimitive = string | number | boolean | null | undefined;
export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | {
      [key: string]: JSONValue;
    };

export interface ApiRequest {
  searchParams?: Record<string, JSONValue>;
  headers?: HeadersInit;
  body?: JSONValue | FormData;
}

declare const _apiDefinitionResponseSymbol: unique symbol;

export interface ApiDefinition<TVariables, _TResponse> {
  endpoint: `/${string}` | ((variables: TVariables) => `/${string}`);
  method: HttpMethod;
  request: (variables: TVariables) => ApiRequest;
  fetchOptions?:
    | Partial<RequestInit>
    | ((variables: TVariables) => Partial<RequestInit>);
  [_apiDefinitionResponseSymbol]?: _TResponse;
}

export interface QueryApiDefinition<
  TServerError,
  TVariables extends Record<string, any> | null = null,
  TResponse = null,
  TQueryKeyVariablesKeys extends keyof TVariables = never,
> extends ApiDefinition<TVariables, TResponse> {
  queryKey: (
    variables: TVariables extends null
      ? TVariables
      : Pick<TVariables, TQueryKeyVariablesKeys> &
          Omit<Partial<TVariables>, TQueryKeyVariablesKeys>,
  ) => QueryKey;
  baseQueryOptions?:
    | Omit<
        UnusedSkipTokenOptions<
          TResponse,
          ApiError<TServerError>,
          TResponse,
          QueryKey
        >,
        "select" | "queryFn" | "queryKey"
      >
    | ((
        variables: TVariables,
      ) => Omit<
        UnusedSkipTokenOptions<
          TResponse,
          ApiError<TServerError>,
          TResponse,
          QueryKey
        >,
        "select" | "queryFn" | "queryKey"
      >);
}

export interface QueryUpdate<TResponse = any> {
  queryKey: QueryKey;
  updater?: (prev?: TResponse) => TResponse | undefined;
}

export interface MutationApiDefinition<
  TVariables = null,
  TResponse = null,
> extends ApiDefinition<TVariables, TResponse> {
  mutationKey: MutationKey;
  updatesOnMutate?: (variables: TVariables) => QueryUpdate[];
  updatesOnSuccess?: (
    variables: TVariables,
    response: TResponse,
  ) => QueryUpdate[];
}

export interface QueryApi<
  TServerError,
  TVariables extends Record<string, any> | null = null,
  TResponse = null,
  TQueryKeyVariablesKeys extends keyof TVariables = never,
> extends QueryApiDefinition<
  TServerError,
  TVariables,
  TResponse,
  TQueryKeyVariablesKeys
> {
  fetch: (
    variables: TVariables,
    options?: Partial<RequestInit>,
  ) => Promise<TResponse>;
  queryOptions: (
    variables: TVariables,
    fetchOptions?: Partial<RequestInit>,
  ) => UnusedSkipTokenOptions<
    TResponse,
    ApiError<TServerError>,
    TResponse,
    QueryKey
  > & {
    queryKey: DataTag<QueryKey, TResponse, ApiError<TServerError>>;
  };
  queryUpdate: (
    variables: TVariables extends null
      ? TVariables
      : Pick<TVariables, TQueryKeyVariablesKeys> &
          Omit<Partial<TVariables>, TQueryKeyVariablesKeys>,
    updater?: (prev?: TResponse) => TResponse | undefined,
  ) => QueryUpdate<TResponse>;
}

export interface MutationApi<
  TServerError,
  TVariables = null,
  TResponse = null,
> extends MutationApiDefinition<TVariables, TResponse> {
  fetch: (
    variables: TVariables,
    options?: Partial<RequestInit>,
  ) => Promise<TResponse>;
  useMutation: <TOnMutateResult = unknown>(
    options?: Omit<
      UseMutationOptions<
        TResponse,
        ApiError<TServerError>,
        TVariables,
        TOnMutateResult
      >,
      "mutationKey" | "mutationFn"
    > & { fetchOptions?: Partial<RequestInit> },
  ) => UseMutationResult<
    TResponse,
    ApiError<TServerError>,
    TVariables,
    TOnMutateResult
  >;
}
