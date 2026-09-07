import {BASE_URL} from '../Constants/common';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface CustomInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<AxiosResponse['data']>>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T>(config: AxiosRequestConfig): Promise<T>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const axiosInstance: CustomInstance = axios.create({
  baseURL: BASE_URL,
});

// 진행 중인 토큰 갱신 요청 — 병렬 401 이 몰려도 /token 호출은 한 번만 수행한다.
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async () => {
  const {accessToken, refreshToken} = await axiosInstance.post<{
    accessToken: string;
    refreshToken: string;
  }>('/token', {
    accessToken: await AsyncStorage.getItem('accessToken'),
    refreshToken: await AsyncStorage.getItem('refreshToken'),
  });

  await Promise.all([
    AsyncStorage.setItem('accessToken', accessToken),
    AsyncStorage.setItem('refreshToken', refreshToken),
  ]);
};

// 여러 요청이 동시에 401 을 받아도 갱신은 한 번만 하고 결과를 공유한다.
// (채팅처럼 하트비트/메시지 조회가 병렬로 도는 화면에서 refresh 토큰이 회전되며
//  뒤늦은 갱신 요청이 실패해 정상 요청까지 실패로 떨어지는 문제 방지)
const refreshAccessTokenOnce = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const stringifyPatchParams = (params: any) => {
  let query = '';
  if (params) {
    Object.keys(params).map((key, index) => {
      if (params[key] !== undefined) {
        query += `${index !== 0 ? '&' : ''}${key}=${params[key]}`;
      }
    });
  }
  return query;
};

axiosInstance.interceptors.request.use(async config => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`);
  }

  if (config.method === 'patch') {
    config.params = config.data;
    config.paramsSerializer = {
      serialize: stringifyPatchParams,
    };
  }

  return config;
});

axiosInstance.interceptors.response.use(
  res => {
    logRequestResult(res);
    return res.data;
  },
  async (error: any) => {
    // 네트워크 단절/타임아웃/요청 취소는 response 가 없다.
    // 예전 코드는 error.response 를 그대로 참조해 이 경우 TypeError 로 바뀌었고,
    // 결과적으로 사소한 네트워크 끊김이 화면의 실패 토스트로 이어졌다.
    const response = error?.response;
    const originalRequest = error?.config;
    logRequestResult(response, error);

    if (
      response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      // /token 자체의 401 에 다시 갱신을 시도하면 재귀 호출이 된다.
      originalRequest.url !== '/token'
    ) {
      originalRequest._retry = true;
      await refreshAccessTokenOnce();
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

function logRequestResult(response?: AxiosResponse, error?: any) {
  const config = response?.config ?? error?.config;
  const message = [
    config?.method?.toUpperCase(),
    [config?.baseURL ?? '', config?.url ?? ''].join(''),
    '|',
    response?.status ?? error?.message ?? 'NO_RESPONSE',
  ];

  if (!response || response.status >= 400) {
    return console.warn(...message);
  }
  return console.log(...message);
}

export {axiosInstance};
