import type { Options } from '../column-types'
import { Fetcher } from '../../power-request/fetcher'

export function createOptionsRequest(url: string) {
  return async (): Promise<Options> => {
    const res = await Fetcher.getInstance().get<{ data: Options }>(url, {})
    return res?.data ?? []
  }
}
