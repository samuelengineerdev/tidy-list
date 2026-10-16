export type ApiSuccessResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  errors?: string;
};
