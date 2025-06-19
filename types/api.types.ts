export interface ApiResponse<T = any> {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
}

export interface ApiError {
  meta: {
    status: number;
    message: string;
  };
  errors?: Record<string, string[]>;
}