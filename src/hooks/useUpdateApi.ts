import { useState, useCallback } from "react";
import revalidateTag from "@/lib/revalidate";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";

// Define types
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any; // Allow any type for body
}

interface ToastType {
  title: string;
  description: string;
}

interface ToastOptions {
  error?: ToastType;
  success?: ToastType;
}

interface UseUpdateApiResponse<T> {
  data: T | null;
  isLoading: boolean; // Renamed for better convention
  error: Error | null; // Use Error type instead of string
  isSuccess: boolean; // New success state
  update: (
    url: string,
    options?: Partial<FetchOptions>,
    tags?: string | null,
    toasted?: ToastOptions,
  ) => Promise<T>; // Renamed and made options optional
  reset: (data?: T) => void; // Added reset functionality
}

// Generic type for initial data
function useUpdateApi<T>(
  onSuccess?: (result: T) => void,
  initialData?: T,
): UseUpdateApiResponse<T> {
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // New success state
  const dispatch = useAppDispatch();
  const update = useCallback(
    async (
      url: string,
      options: Partial<FetchOptions> = {},
      tags?: string | null,
      toasted?: ToastOptions,
    ) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false); // Reset success state before making the request

      // Default headers and options
      const defaultOptions: FetchOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        ...options,
      };

      // Stringify body if it's an object
      if (options.body && typeof options.body === "object") {
        defaultOptions.body = JSON.stringify(options.body);
      }

      try {
        const response = await fetch(url, defaultOptions);
        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        let result: T;

        if (contentType?.includes("application/json")) {
          result = await response.json();
        } else {
          result = (await response.text()) as unknown as T;
        }

        if (!response.ok) {
          throw new Error(
            (result as any)?.message || `Update failed: ${response.status}`,
          );
        }

        setData(result);
        setIsSuccess(true); // Set success state to true
        tags && (await revalidateTag(tags));
        onSuccess?.(result);
        toasted?.success &&
          toast.success(toasted.success?.title, {
            description: toasted.success?.description,
            position: "bottom-right",
            style: {
              "--normal-bg": "color-mix(in oklab, var(--primary) 10%, white)",
              "--normal-text": "var(--primary)",
              "--normal-border": "var(--primary)",
            } as React.CSSProperties,
          });
        return result;
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error(String(err));
        setError(errorInstance);
        setIsSuccess(false); // Ensure success state is false on error
        toasted?.error &&
          toast.error(toasted.error?.title, {
            description: toasted.error?.description,
            position: "bottom-right",
            style: {
              "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
              "--normal-text": "var(--destructive)",
              "--normal-border": "color-mix(in oklab, var(--destructive) 25%, white)",
            } as React.CSSProperties,
          });
        throw errorInstance;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess],
  );

  const reset = useCallback(
    (data?: T) => {
      setData(data ?? initialData ?? null);
      setError(null);
      setIsLoading(false);
      setIsSuccess(false); // Reset success state
    },
    [initialData],
  );

  return { data, isLoading, error, isSuccess, update, reset };
}

export default useUpdateApi;

//  const { isLoading, error, update, reset } = useUpdateApi<Folder>(onSuccess);

//   const handleSubmit = async (body: Partial<Folder>) => {
//     if (body.id) {
//       await update(API_CREATE_FOLDER, { body }, TAGS.folders);
//     } else {
//       await update(API_CREATE_FOLDER, { method: "POST", body }, TAGS.folders);
//     }
//   };
//   function onSuccess() {
//     onClose();
//   }
