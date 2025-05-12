import {BASE_URL_TEST} from '../Constants/common';
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
  baseURL: BASE_URL_TEST,
});

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
    logRequestResult(error.response);

    if (error.response.status === 401 && !error.config._retry) {
      const originalRequest = error.config;
      await refreshAccessToken();
      originalRequest._retry = true;
      const newResponse = axiosInstance(originalRequest);
      return newResponse;
    }

    return Promise.reject(error);
  },
);

function logRequestResult(response: AxiosResponse): void {
  const message = [
    response.config.method?.toUpperCase(),
    [response.config.baseURL, response.config.url].join(''),
    '|',
    response.status,
  ];

  if (response.status !== 200) {
    return console.warn(...message);
  }
  return console.log(...message);
}

export {axiosInstance};
