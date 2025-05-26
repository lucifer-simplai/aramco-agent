import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { DEFAULT_PAGE_SIZE } from "../constants";
import _authHttp from "../services/authHttp";
import { getErrorFromApi } from "../utils/helperFunction";

const fetcher = async (url, params, headers, signal) => {
  try {
    const response = await _authHttp.get(url, {
      params,
      headers,
      signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
      throw new Error(error.response?.data?.message || "API error");
    }
  }
};

export const useFetchData = (
  url,
  params = {},
  headers = {},
  customQueryOptions = {
    enabled: true,
    refetchInterval: false,
  },
) => {
  const queryOptions = {
    queryKey: ["customFetch", url, params, headers],
    queryFn: ({ signal }) => fetcher(url, params, { ...headers }, signal),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...customQueryOptions,
  };

  return useQuery(queryOptions);
};

export const useFetchInfiniteData = (
  url,
  params = {},
  headers = {},
  pageSize = DEFAULT_PAGE_SIZE,
  fetchKey = "",
  options = {},
) => {
  const queryOptions = {
    queryKey: ["customFetch", fetchKey, url, params, headers],
    queryFn: ({ signal, pageParam = 1 }) => {
      return fetcher(
        url,
        { ...params, page: pageParam - 1 },
        { ...headers },
        signal,
      );
    },
    retry: 0,
    ...options,
    getNextPageParam: (lastPage, allPages) => {
      const maxPage = lastPage?.totalElements / pageSize;
      const nextPage = allPages?.length + 1;
      return nextPage <= maxPage ? nextPage : undefined;
    },
  };

  return useInfiniteQuery(queryOptions);
};
const postData = async (url, payload, params, headers) => {
  try {
    const response = await _authHttp.post(url, payload, {
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorFromApi(error));
  }
};

export const usePostData = (key, queryKeys = []) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: key,
    mutationFn: async ({ url, payload = {}, params = {}, headers = {} }) => {
      try {
        const response = await postData(url, payload, params, headers);
        return response;
      } catch (error) {
        throw new Error(getErrorFromApi(error));
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [...queryKeys] });
    },
  });
};
