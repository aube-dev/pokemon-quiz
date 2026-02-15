/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type MutateOptions,
  type QueryKey,
  queryOptions,
  type UnusedSkipTokenOptions,
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  ApiDefinition,
  MutationApi,
  MutationApiDefinition,
  QueryApi,
  QueryApiDefinition,
  QueryUpdate,
} from "@/types/api";
import { ApiError } from "./ApiError";
import qs from "qs";

interface ApiOptions<TServerError> {
  queryOptions?: Omit<
    UnusedSkipTokenOptions<
      unknown,
      ApiError<TServerError>,
      unknown,
      readonly unknown[]
    >,
    "select" | "queryFn" | "queryKey" | "initialData" | "initialDataUpdatedAt"
  >;
  mutationOptions?: Omit<
    UseMutationOptions<unknown, ApiError<TServerError>, unknown, unknown>,
    "mutationKey" | "mutationFn"
  >;
  hooks?: {
    beforeServerError?: (
      error: ApiError<TServerError>,
    ) => ApiError<TServerError>;
  };
  baseUrl?: string;
}

export class Api<TServerError> {
  private apiKey: symbol;
  private options?: ApiOptions<TServerError>;

  constructor(options?: ApiOptions<TServerError>) {
    this.apiKey = Symbol();
    this.options = options;
  }

  public setOptions(
    options:
      | ApiOptions<TServerError>
      | ((prevOptions?: ApiOptions<TServerError>) => ApiOptions<TServerError>),
  ) {
    this.options =
      typeof options === "function" ? options(this.options) : options;
  }

  public isApiError(error: unknown): error is ApiError<TServerError> {
    return error instanceof ApiError && error.apiKey === this.apiKey;
  }

  private getFetchParams<TVariables, TResponse>(
    apiDefinition: ApiDefinition<TVariables, TResponse>,
    variables: TVariables,
  ): [url: RequestInfo | URL, init?: RequestInit] {
    const { method, endpoint, request } = apiDefinition;
    const { searchParams, headers, body } = request(variables);

    const url =
      (this.options?.baseUrl ?? "") +
      (typeof endpoint === "function" ? endpoint(variables) : endpoint) +
      qs.stringify(searchParams, {
        arrayFormat: "repeat",
        addQueryPrefix: true,
      });

    const isFormData = body instanceof FormData;

    return [
      url,
      {
        method,
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
          ...headers,
        },
        body: isFormData ? body : JSON.stringify(body),
      },
    ];
  }

  private async fetch<TVariables, TResponse>(
    apiDefinition: ApiDefinition<TVariables, TResponse>,
    variables: TVariables,
    options?: Partial<RequestInit>,
  ): Promise<TResponse> {
    const [url, baseOptions] = this.getFetchParams(apiDefinition, variables);

    const { fetchOptions } = apiDefinition;

    const finalOptions = {
      ...baseOptions,
      ...(typeof fetchOptions === "function"
        ? fetchOptions(variables)
        : fetchOptions),
      ...options,
    };

    const fetchParams = [url, finalOptions] as const;

    try {
      const response = await fetch(...fetchParams);

      let result;
      try {
        result = await response.json();
      } catch (_error) {
        result = null;
      }

      if (response.ok) {
        return result;
      }

      const rawServerError = new ApiError<TServerError>({
        apiKey: this.apiKey,
        fetchParams,
        serverError: result,
      });

      throw (
        this.options?.hooks?.beforeServerError?.(rawServerError) ??
        rawServerError
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError<TServerError>({
        apiKey: this.apiKey,
        fetchParams,
        clientError: error,
      });
    }
  }

  private queryOptions<
    TVariables extends Record<string, any> | null,
    TResponse,
    TQueryKeyVariablesKeys extends keyof TVariables,
  >(
    apiDefinition: QueryApiDefinition<
      TServerError,
      TVariables,
      TResponse,
      TQueryKeyVariablesKeys
    >,
    variables: TVariables,
    fetchOptions?: Partial<RequestInit>,
  ) {
    const { queryKey, baseQueryOptions } = apiDefinition;

    return queryOptions<TResponse, ApiError<TServerError>, TResponse, QueryKey>(
      {
        ...(this.options?.queryOptions as Omit<
          UnusedSkipTokenOptions<
            TResponse,
            ApiError<TServerError>,
            TResponse,
            QueryKey
          >,
          "select" | "queryFn" | "queryKey"
        >),
        ...(typeof baseQueryOptions === "function"
          ? baseQueryOptions(variables)
          : baseQueryOptions),
        queryKey: queryKey(
          variables as TVariables extends null ? TVariables : TVariables,
        ),
        queryFn: () =>
          this.fetch<TVariables, TResponse>(
            apiDefinition,
            variables,
            fetchOptions,
          ),
      },
    );
  }

  private useMutation<TVariables, TResponse, TOnMutateResult = unknown>(
    apiDefinition: MutationApiDefinition<TVariables, TResponse>,
    options?: Omit<
      UseMutationOptions<
        TResponse,
        ApiError<TServerError>,
        TVariables,
        TOnMutateResult
      >,
      "mutationKey" | "mutationFn"
    > & { fetchOptions?: Partial<RequestInit> },
  ) {
    const { updatesOnMutate, updatesOnSuccess } = apiDefinition;
    const {
      onMutate: onMutateBase,
      onSuccess: onSuccessBase,
      onError: onErrorBase,
      onSettled: onSettledBase,
      ...restBaseOptions
    } = this.options?.mutationOptions ?? {};
    const {
      onMutate,
      onSuccess,
      onError,
      onSettled,
      fetchOptions,
      ...restOptions
    } = options ?? {};

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryClient = useQueryClient();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mutation = useMutation<
      TResponse,
      ApiError<TServerError>,
      TVariables,
      {
        onMutateResult?: TOnMutateResult;
        prevData: { queryKey: QueryKey; prev: unknown }[];
      }
    >({
      ...restBaseOptions,
      ...restOptions,
      mutationKey: apiDefinition.mutationKey,
      mutationFn: (variables) =>
        this.fetch<TVariables, TResponse>(
          apiDefinition,
          variables,
          fetchOptions,
        ),
      onMutate: async (variables, context) => {
        const prevDataPromise = Promise.all(
          (updatesOnMutate?.(variables) ?? [])
            .filter(
              (update): update is Required<QueryUpdate> =>
                update.updater !== undefined,
            )
            .map((update) =>
              (async () => {
                await queryClient.cancelQueries({ queryKey: update.queryKey });
                const prev = queryClient.getQueryData(update.queryKey);
                const newData = update.updater(prev);
                queryClient.setQueryData(update.queryKey, newData);
                return { queryKey: update.queryKey, prev };
              })(),
            ),
        );
        const [prevData, _baseOnMutateResult, onMutateResult] =
          await Promise.all([
            prevDataPromise,
            onMutateBase?.(variables, context),
            onMutate?.(variables, context),
          ]);
        return { onMutateResult, prevData };
      },
      onError: async (
        error,
        variables,
        { onMutateResult, prevData } = { prevData: [] },
        context,
      ) => {
        prevData.forEach((prev) => {
          queryClient.setQueryData(prev.queryKey, prev.prev);
        });
        await Promise.all([
          onErrorBase?.(error, variables, onMutateResult, context),
          onError?.(error, variables, onMutateResult, context),
        ]);
      },
      onSuccess: async (data, variables, { onMutateResult }, context) => {
        (updatesOnSuccess?.(variables, data) ?? [])
          .filter(
            (update): update is Required<QueryUpdate> =>
              update.updater !== undefined,
          )
          .forEach((update) => {
            try {
              const prev = queryClient.getQueryData(update.queryKey);
              const newData = update.updater(prev);
              queryClient.setQueryData(update.queryKey, newData);
            } catch (error) {
              console.error(error);
              throw error;
            }
          });
        await Promise.all([
          onSuccessBase?.(data, variables, onMutateResult, context),
          onSuccess?.(
            data,
            variables,
            // @ts-expect-error `TContext`는 `onMutate`의 반환값에 따라 자동 추론되므로 `undefined`를 따로 처리할 필요가 없다.
            onMutateResult,
            context,
          ),
        ]);
      },
      onSettled: async (
        data,
        error,
        variables,
        { onMutateResult } = { prevData: [] },
        context,
      ) => {
        (updatesOnMutate?.(variables) ?? [])
          .concat(
            data !== undefined && updatesOnSuccess !== undefined
              ? updatesOnSuccess(variables, data)
              : [],
          )
          .forEach((update) => {
            queryClient.invalidateQueries({ queryKey: update.queryKey });
          });
        await Promise.all([
          onSettledBase?.(data, error, variables, onMutateResult, context),
          onSettled?.(data, error, variables, onMutateResult, context),
        ]);
      },
    });

    return {
      ...mutation,
      context: mutation.context?.onMutateResult,
      mutate: (
        variables: TVariables,
        mutateOptions?: MutateOptions<
          TResponse,
          ApiError<TServerError>,
          TVariables,
          TOnMutateResult
        >,
      ) =>
        mutation.mutate(variables, {
          ...mutateOptions,
          onError: (e, v, o, c) =>
            mutateOptions?.onError?.(e, v, o?.onMutateResult, c),
          onSettled: (d, e, v, o, c) =>
            mutateOptions?.onSettled?.(d, e, v, o?.onMutateResult, c),
          onSuccess: (d, v, o, c) =>
            mutateOptions?.onSuccess?.(d, v, o?.onMutateResult, c),
        }),
      mutateAsync: (
        variables: TVariables,
        mutateOptions?: MutateOptions<
          TResponse,
          ApiError<TServerError>,
          TVariables,
          TOnMutateResult
        >,
      ) =>
        mutation.mutateAsync(variables, {
          ...mutateOptions,
          onError: (e, v, o, c) =>
            mutateOptions?.onError?.(e, v, o?.onMutateResult, c),
          onSettled: (d, e, v, o, c) =>
            mutateOptions?.onSettled?.(d, e, v, o?.onMutateResult, c),
          onSuccess: (d, v, o, c) =>
            mutateOptions?.onSuccess?.(d, v, o?.onMutateResult, c),
        }),
    };
  }

  public queryApi<
    TVariables extends Record<string, any> | null = null,
    TResponse = null,
    TQueryKeyVariablesKeys extends keyof TVariables = never,
  >(
    apiDefinition: QueryApiDefinition<
      TServerError,
      TVariables,
      TResponse,
      TQueryKeyVariablesKeys
    >,
  ): QueryApi<TServerError, TVariables, TResponse, TQueryKeyVariablesKeys> {
    return {
      ...apiDefinition,
      fetch: (variables, options) =>
        this.fetch(apiDefinition, variables, options),
      queryOptions: (variables, fetchOptions) =>
        this.queryOptions(apiDefinition, variables, fetchOptions),
      queryUpdate: (variables, updater) => ({
        queryKey: apiDefinition.queryKey(variables),
        updater,
      }),
    };
  }

  public mutationApi<TVariables = null, TResponse = null>(
    apiDefinition: MutationApiDefinition<TVariables, TResponse>,
  ): MutationApi<TServerError, TVariables, TResponse> {
    return {
      ...apiDefinition,
      fetch: (variables, options) =>
        this.fetch(apiDefinition, variables, options),
      useMutation: (options) => this.useMutation(apiDefinition, options),
    };
  }
}
