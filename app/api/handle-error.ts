// src/hooks/use-handle-api-error.ts
import { ApiErrorResponse } from "@/api/base-api";
import { HttpStatus } from "@/api/http-status";
import { useAppToast } from "@/hooks/use-app-toast";
import { useRouter } from "expo-router";

export function useHandleError() {
  const toast = useAppToast();
  const router = useRouter();

  const handleApiError = (error: unknown) => {
    console.log(error)
    const apiError = error as ApiErrorResponse;

    const formattedError = {
      statusCode: apiError?.data?.statusCode,
      message: Array.isArray(apiError?.data?.message)
        ? apiError.data.message[0]
        : apiError?.data?.message || "An unexpected error occurred.",
    };

    // 💡 Handle error based on HTTP status code
    switch (formattedError.statusCode) {
      case HttpStatus.CONFLICT:
        toast.info(formattedError.message);
        break;

      case HttpStatus.UNAUTHORIZED:
        toast.info(formattedError.message || "Session expired. Please log in again.");
        // router.push("/login");
        break;

      case HttpStatus.FORBIDDEN:
        toast.info(formattedError.message || "You do not have permission to access this resource.");
        break;

      case HttpStatus.NOT_FOUND:
        toast.info(formattedError.message || "The requested resource was not found.");
        break;

      case HttpStatus.INTERNAL_SERVER_ERROR:
        toast.error(formattedError.message || "Server error. Please try again later.");
        break;

      default:
        toast.error(formattedError.message);
        break;
    }
  };

  return { handleApiError };
}
