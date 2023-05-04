import {BASE_URL_PROD} from '../Constants/common';
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
  baseURL: BASE_URL_PROD,
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

// function loggingRequest(method: string, url: string, status: number): void {
//   console.log(method, url, '|', status);
// }

// class Instance {
//   baseUrl: string;

//   constructor(BASE_URL: string) {
//     this.baseUrl = BASE_URL;
//   }

//   async post(path: string, body?: {}, headers?: {}) {
//     const url = this.baseUrl + path;
//     const options: {method: 'POST'; headers: any; body?: string} = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers,
//       },
//     };
//     if (body) {
//       options.body = JSON.stringify(body);
//     }
//     const res = await fetch(url, options);
//     let data;
//     const contentType = res.headers.get('content-type');
//     if (contentType && contentType.indexOf('application/json') !== -1) {
//       data = await res.json();
//     }
//     loggingRequest('POST', url, res.status);

//     if (res.ok) {
//       return data;
//     } else {
//       throw Error(data.message);
//     }
//   }

//   async get(path: string, params?: {[key: string]: any}, headers?: {}) {
//     let query = '';
//     if (params) {
//       Object.keys(params).map((key, index) => {
//         if (params[key] !== undefined) {
//           query += `${index === 0 ? '?' : '&'}${key}=${params[key]}`;
//         }
//       });
//     }
//     const url = this.baseUrl + path + query;
//     const options = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers,
//       },
//     };

//     const res = await fetch(url, options);
//     const data = await res.json();
//     loggingRequest('GET', url, res.status);

//     if (res.ok) {
//       return data;
//     } else {
//       throw Error(data.message);
//     }
//   }
// }

// class InstanceWithAuth {
//   baseUrl: string;

//   constructor(BASE_URL: string) {
//     this.baseUrl = BASE_URL;
//   }

//   private async getAccessToken() {
//     return await AsyncStorage.getItem('accessToken');
//   }

//   private async getRefreshToken() {
//     return await AsyncStorage.getItem('refreshToken');
//   }

//   async post(path: string, body?: {}, headers?: {}): Promise<any> {
//     const url = this.baseUrl + path;

//     const options: {method: 'POST'; headers: any; body?: string} = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${await this.getAccessToken()}`,
//         ...headers,
//       },
//     };

//     if (body) {
//       options.body = JSON.stringify(body);
//     }

//     const res = await fetch(url, options);
//     let data;
//     const contentType = res.headers.get('content-type');
//     if (contentType && contentType.indexOf('application/json') !== -1) {
//       data = await res.json();
//     }
//     loggingRequest('POST', url, res.status);

//     if (res.ok) {
//       return data;
//     } else {
//       if (res.status === 401) {
//         console.error(data.message);
//         return await this.refreshAccessToken({
//           method: 'post',
//           path,
//           data: body,
//           headers,
//         });
//       } else {
//         throw Error(data.message);
//       }
//     }
//   }

//   async get(
//     path: string,
//     params?: {[key: string]: any},
//     headers?: {},
//   ): Promise<any> {
//     let query = '';
//     if (params) {
//       Object.keys(params).map((key, index) => {
//         if (params[key] !== undefined) {
//           if (params[key] !== undefined) {
//             query += `${index === 0 ? '?' : '&'}${key}=${params[key]}`;
//           }
//         }
//       });
//     }
//     const url = this.baseUrl + path + query;

//     const options = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${await this.getAccessToken()}`,
//         ...headers,
//       },
//     };

//     const res = await fetch(url, options);
//     const data = await res.json();
//     loggingRequest('GET', url, res.status);

//     if (res.ok) {
//       return data;
//     } else {
//       if (res.status === 401) {
//         console.error(data.message);
//         return await this.refreshAccessToken({
//           method: 'get',
//           path,
//           data: params,
//           headers,
//         });
//       } else {
//         throw Error(data.message);
//       }
//     }
//   }

//   async patch(
//     path: string,
//     params?: {[key: string]: any},
//     headers?: {},
//   ): Promise<any> {
//     let query = '';
//     if (params) {
//       Object.keys(params).map((key, index) => {
//         if (params[key] !== undefined) {
//           query += `${index === 0 ? '?' : '&'}${key}=${params[key]}`;
//         }
//       });
//     }
//     console.log(query);
//     const url = this.baseUrl + path + query;

//     const options = {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${await this.getAccessToken()}`,
//         ...headers,
//       },
//     };

//     const res = await fetch(url, options);
//     // const data = await res.json();
//     loggingRequest('PATCH', url, res.status);

//     if (res.ok) {
//       return res;
//     } else {
//       if (res.status === 401) {
//         console.error(res.statusText);
//         return await this.refreshAccessToken({
//           method: 'get',
//           path,
//           data: params,
//           headers,
//         });
//       } else {
//         throw Error(res.statusText);
//       }
//     }
//   }

//   async delete(path: string): Promise<any> {
//     const url = this.baseUrl + path;

//     const options = {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${await this.getAccessToken()}`,
//       },
//     };

//     const res = await fetch(url, options);
//     // const data = await res.json();
//     loggingRequest('DELETE', url, res.status);

//     if (res.ok) {
//       return res;
//     } else {
//       if (res.status === 401) {
//         console.error(res.statusText);
//         return await this.refreshAccessToken({
//           method: 'delete',
//           path,
//         });
//       } else {
//         throw Error(res.statusText);
//       }
//     }
//   }

//   private async refreshAccessToken({
//     method,
//     path,
//     data,
//     headers,
//   }: {
//     method: string;
//     path: string;
//     data?: any;
//     headers?: {};
//   }) {
//     try {
//       const {accessToken, refreshToken} = await instance.post('/token', {
//         accessToken: await this.getAccessToken(),
//         refreshToken: await this.getRefreshToken(),
//       });
//       console.log(
//         'Get New Tokens',
//         '\nAccessToken',
//         accessToken,
//         '\nRefreshToken',
//         refreshToken,
//       );

//       await AsyncStorage.setItem('accessToken', accessToken);
//       await AsyncStorage.setItem('refreshToken', refreshToken);

//       if (method === 'post') {
//         return await this.post(path, data, headers);
//       } else if (method === 'get') {
//         return await this.get(path, data, headers);
//       } else if (method === 'patch') {
//         return await this.patch(path, data, headers);
//       } else if (method === 'delete') {
//         return await this.delete(path);
//       }
//     } catch (error: any) {
//       console.error(error.message);
//     }
//   }
// }

// export const instance = new Instance(BASE_URL_TEST);
// export const instanceWithAuth = new InstanceWithAuth(BASE_URL_TEST);
