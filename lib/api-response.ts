export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}



export function createSuccessResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(
  message: string,
  error?: string
): ApiResponse<unknown> {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
}
