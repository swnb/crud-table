import type { ColProps } from 'antd'
import type { ReactNode } from 'react'
import type { ProColumns } from '@ant-design/pro-table'
import type { Fn } from '../types'

export type ColumnType<T> = ProColumns<T> & {
  hideInUpdate?: boolean
  hideInCreate?: boolean
}

type RequestCommonConfig = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  otherParams: Record<string, string>
}

export type Actions<T> = ({ title: ReactNode } & (
  | { subActions: Actions<T> }
  | { onClick: Fn<[T], boolean | void>; powerType?: 'update' | 'delete' }
))[]

export type CRUDTableConfig = {
  form: {
    labelCol?: ColProps
    wrapperCol?: ColProps
  }
  query: Omit<RequestCommonConfig, 'method'> & {
    defaultPageSize: number
    defaultPageIndex: number
  }
  create: RequestCommonConfig & { paramsJson: boolean }
  update: RequestCommonConfig & { paramsJson: boolean }
  remove: RequestCommonConfig
  drawer?: { width: number; title?: string }
  actions: { width: number }
}

export type Option = {
  label: string
  value: number
}

export type Options = Option[]
