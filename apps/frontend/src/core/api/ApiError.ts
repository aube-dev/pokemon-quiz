interface IApiError<TServerErrorResponse> {
  apiKey: symbol;
  message?: string;
  fetchParams: readonly [url: RequestInfo | URL, init?: RequestInit];
  serverError?: TServerErrorResponse;
  clientError?: unknown;
}

export class ApiError<TServerErrorResponse> extends Error {
  public apiKey: symbol;
  public fetchParams: IApiError<TServerErrorResponse>["fetchParams"];
  public serverError?: IApiError<TServerErrorResponse>["serverError"];
  public clientError?: IApiError<TServerErrorResponse>["clientError"];

  constructor(errorInfo: IApiError<TServerErrorResponse>) {
    super(
      errorInfo.message !== undefined && errorInfo.message.length > 0
        ? errorInfo.message
        : "오류가 발생했습니다.",
    );
    this.name = "ApiError";
    this.apiKey = errorInfo.apiKey;
    this.fetchParams = errorInfo.fetchParams;
    this.serverError = errorInfo.serverError;
    this.clientError = errorInfo.clientError;
  }
}
