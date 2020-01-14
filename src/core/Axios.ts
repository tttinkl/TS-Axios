import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  Axios as AxiosInterface,
  ResolvedFn,
  RejectedFn,
  AxiosResponse
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './Interceptormanager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios implements AxiosInterface {
  interceptors: Interceptors
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request<T>(url: any, config?: any): AxiosPromise<T> {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithoutData('head', url, config)
  }

  options<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithoutData('options', url, config)
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('post', url, data, config)
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._requestMethodWithData('patch', url, data, config)
  }
  _requestMethodWithoutData<T>(
    method: Method,
    url: string,
    config: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
  _requestMethodWithData<T>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
}
