import { useEffect, useState } from "react";
import Interceptor from "@/service/Interceptor";
import { AxiosError, AxiosRequestConfig } from "axios";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface UseFetchOptions<T> {
  url: string;
  method?: RequestMethod;
  body?: T;
  params?: Record<string, any>;
  dependencies?: any[];
  enabled?: boolean;
}

const useFetch = <T,>({
  url,
  method = "GET",
  body,
  params,
  dependencies = [],
  enabled = true,
}: UseFetchOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        data: body,
        params,
      };

      const response = await Interceptor.getInstance().getAxiosInstance()(config);
      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [...dependencies, enabled]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetch;