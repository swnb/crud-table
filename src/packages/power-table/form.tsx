import type { ColumnType } from './column-types'
import type { CRUDTableConfig } from './column-types'
import type { Fn } from '../types'
import type { ProFormColumnsType } from '@ant-design/pro-form'
import { BetaSchemaForm } from '@ant-design/pro-form'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'antd/lib/form/Form'
import { Fetcher } from '../power-request/fetcher'

export interface IEditFormProps<T> {
  opType: 'create' | 'update'
  record: T | null
  columns: ColumnType<T>[]
  config: CRUDTableConfig
  refresh: Fn<[], Promise<any>>
  onClose: Fn
}

const Console = console

function mapProColumnsIntoProFormColumns<T>(type: 'create' | 'update') {
  return (column: ColumnType<T>): ProFormColumnsType => {
    let hide: boolean
    if (column.hideInForm) {
      hide = true
    } else if (type === 'update') {
      if (column.hideInUpdate) {
        hide = true
      }
    } else if (column.hideInCreate) {
      hide = true
    }

    const formColumns = {
      dataIndex: column.dataIndex,
      valueType: column.valueType,
      formItemProps: { ...column.formItemProps, label: column.title },
      fieldProps: column.fieldProps,
      hideInForm: hide,
    }
    if (column.request) {
      // @ts-ignore
      formColumns.request = column.request
    }

    return formColumns
  }
}

export function EditForm<T extends { id: number }>({
  opType,
  record,
  columns: proColumns,
  config,
  refresh,
  onClose,
}: IEditFormProps<T>) {
  const { create, update } = config

  const [form] = useForm<T>()

  const [formColumns, setFormColumns] = useState(
    proColumns.map(mapProColumnsIntoProFormColumns(opType)),
  )
  useEffect(() => {
    const mapper = mapProColumnsIntoProFormColumns(opType)
    setFormColumns(proColumns.map(mapper))
  }, [proColumns, opType])

  useEffect(() => {
    if (opType === 'update') {
      form.resetFields()
      // @ts-ignore
      form.setFieldsValue({ ...record })
    } else {
      form.resetFields()
    }
  }, [form, opType, record])

  const onFinish = useCallback(async () => {
    const values = await form.validateFields()
    const fetcher = Fetcher.getInstance()
    if (opType === 'update') {
      const response = await fetcher.putJSON(update.url, {
        ...values,
        id: record?.id,
        ...update.otherParams,
      })
      // TODO 处理响应
      Console.log(response)
      onClose()
      await refresh()
    } else {
      const params = { ...values, ...create.otherParams }
      // @ts-ignore
      delete params.id
      const response = await fetcher.postJSON(create.url, params)
      // TODO 处理响应
      Console.log(response)
      onClose()
      form.resetFields()
      await refresh()
    }
  }, [
    form,
    opType,
    update.url,
    update.otherParams,
    record?.id,
    onClose,
    refresh,
    create.otherParams,
    create.url,
  ])

  return (
    <BetaSchemaForm<T>
      labelCol={config.form.labelCol}
      wrapperCol={config.form.wrapperCol}
      layout='horizontal'
      form={form}
      columns={formColumns}
      onFinish={onFinish}
    />
  )
}
