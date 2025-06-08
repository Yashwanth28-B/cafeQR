import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiHookOptions {
  immediate?: boolean;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<any>,
  options: ApiHookOptions = { immediate: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(...args);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [options.immediate]);

  return { data, loading, error, execute, refetch: execute };
}
