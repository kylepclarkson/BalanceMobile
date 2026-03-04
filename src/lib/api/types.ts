// Shape of error response bodies returned by Django REST Framework.
// Field-level errors are arrays of strings; non-field errors use 'detail'.
export type ApiErrorBody = {
  detail?: string;
  [field: string]: string | string[] | undefined;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody,
  ) {
    super(body.detail ?? `HTTP error ${status}`);
    this.name = 'ApiError';
  }
}

// DRF paginated list response — used by the transaction list endpoint.
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
