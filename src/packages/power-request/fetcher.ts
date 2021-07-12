import type { AxiosResponse } from 'axios'
// import { message } from 'antd'
import Axios from 'axios'
import { getToken } from './login'

type Obj = Record<string, unknown>

export class Fetcher {
  protected static instance = new Fetcher()

  protected axios = Axios.create({
    // @ts-ignore
    baseURL:
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_SERVER_ADDRESS
        : process.env.REACT_APP_PRO_SERVER_ADDRESS,
  })

  private defaultHeaders: Obj = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  static create = () => new Fetcher()

  static getInstance = () => Fetcher.instance

  get = async <R, T extends Obj | URLSearchParams = Obj, H extends Obj = Obj>(
    path: string,
    params: T,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders)
    const response = await this.axios.get<R>(path, { params, headers })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  post = async <R, D extends Obj | FormData, H extends Obj>(
    path: string,
    data: D,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders)
    const response = await this.axios.post<R>(path, data, {
      headers,
      transformRequest: [
        function urlEncode(params: Record<string, any>) {
          let ret = ''
          Object.keys(data).forEach(it => {
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(params[it])}&`
          })
          return ret
        },
      ],
    })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  postJSON = async <R, D extends Obj | FormData, H extends Obj>(
    path: string,
    data: D,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders, { 'Content-Type': 'application/json' })

    const response = await this.axios.post<R>(path, data, { headers })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  put = async <R, D extends Obj | FormData, H extends Obj>(
    path: string,
    data: D,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders)
    const response = await this.axios.put<R>(path, data, {
      headers,
      transformRequest: [
        function urlEncode(params: Record<string, any>) {
          let ret = ''
          Object.keys(data).forEach(it => {
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(params[it])}&`
          })
          return ret
        },
      ],
    })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  putJSON = async <R, D extends Obj | FormData, H extends Obj>(
    path: string,
    data: D,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders, { 'Content-Type': 'application/json' })

    const response = await this.axios.put<R>(path, data, { headers })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  delete = async <R, T extends Obj | URLSearchParams, H extends Obj>(
    path: string,
    params: T,
    headers: H = Object(),
  ) => {
    const shouldRequest = this.beforeRequest()
    if (!shouldRequest) return null

    Object.assign(headers, this.defaultHeaders)
    const response = await this.axios.delete<R>(path, { params, headers })

    const isRequestSuccess = this.afterRequest(response)
    if (!isRequestSuccess) return null

    return response.data
  }

  protected beforeRequest = (): boolean => {
    const token = getToken()
    if (!token) return false
    this.defaultHeaders['X-Access-Token'] = token
    return true
  }

  // FIXME 修复一些网络请求的问题
  protected afterRequest = (_response: AxiosResponse<any>) => {
    // if (response.status === 200) {
    //   if (response.data.code === 200) {
    //     return true
    //   }
    //   if (response.data.code === 401) {
    //     window.location.pathname = '/login'
    //     return false
    //   }
    //   message.error(response.data.message)
    //   return false
    // }
    // return false
    return true
  }
}
