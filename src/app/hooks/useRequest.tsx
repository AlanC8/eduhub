// hooks/useRequest.ts (предположим, ты положишь его сюда)
import { useState } from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Interceptor from "@/service/Interceptor"; // Убедись, что путь правильный

// Определим общий тип для данных ответа, чтобы можно было указать ожидаемую структуру
// Например, для логина это { data: { token: string; user_id: number } }
interface ApiResponse<D = any> {
  data: D;
  // Могут быть и другие поля, если твой API их возвращает на верхнем уровне
}

const useRequest = <ResponseData = any, RequestBody = any>() => {
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState<AxiosError<any> | null>(null); // Уточняем тип ошибки
  const [loading, setLoading] = useState(false);

  const request = async (
    url: string,
    options: Omit<AxiosRequestConfig<RequestBody>, 'url'>
  ): Promise<ResponseData> => { // Возвращаем непосредственно данные из поля data ответа API
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response: AxiosResponse<ResponseData> = await Interceptor.getInstance()
        .getAxiosInstance()
        .request<ResponseData>({
          url,
          ...options,
        });
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      setError(axiosError);
      console.error("Request failed:", axiosError.response?.data || axiosError.message);
      throw axiosError; // Перебрасываем ошибку, чтобы ее можно было поймать в вызывающем коде
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};

export default useRequest;