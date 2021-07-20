import type { ProColumns } from '..'
import { useDefaultActions, useInitialPowerTableConfig } from '..'
import { CRUDTable } from '..'
import { createOptionsRender } from '..'
import { createOptionsRequest } from '..'
import { createDateRangeSearchColumn } from '..'

type Option = { value: number; label: string }

type Good = {
  id: number
  name: string
  price: number
  number: number
  weight: number
  tags: Option[]
  description: string
}

localStorage.setItem('token', 'swnb')

const formItemProps = { rules: [{ required: true, message: '此项为必填项' }] }

const columns: ProColumns<Good>[] = [
  {
    title: '名字',
    dataIndex: 'name',
    width: 120,
    formItemProps,
  },
  {
    title: '价格',
    hideInSearch: true,
    dataIndex: 'price',
    valueType: 'digit',
  },
  {
    title: '数量',
    hideInSearch: true,
    dataIndex: 'number',
    valueType: 'digit',
    formItemProps,
  },
  {
    title: '重量',
    hideInSearch: true,
    dataIndex: 'weight',
    valueType: 'text',
    formItemProps,
  },
  {
    title: '状态',
    hideInSearch: true,
    dataIndex: 'status',
    valueType: 'radioButton',
    request: createOptionsRequest('/api/v1/status'),
    formItemProps,
    valueEnum: {
      100: { text: '正常', status: 'Success' },
      101: {
        text: '禁用',
        status: 'Error',
      },
      102: {
        text: '丢失',
        status: 'Warning',
        disabled: true,
      },
    },
  },
  {
    title: '标签',
    dataIndex: 'tags',
    valueType: 'select',
    hideInSearch: true,
    formItemProps: {
      ...formItemProps,
      rules: [],
    },
    fieldProps: {
      labelInValue: true,
      mode: 'multiple',
    },
    request: createOptionsRequest('/api/v1/tags'),
    render: createOptionsRender('tags'),
  },
  {
    title: '创建时间',
    width: 120,
    dataIndex: 'createdAt',
    valueType: 'date',
    hideInSearch: true,
    formItemProps: {},
  },
  createDateRangeSearchColumn('创建时间'),
  {
    title: '描述',
    dataIndex: 'description',
    width: 120,
    formItemProps,
    // ellipsis: true,
  },
]

export function CRUDTableExample() {
  const config = useInitialPowerTableConfig(`/api/v1/goods`)

  const actions = useDefaultActions<Good>([{ type: 'update' }, { type: 'delete' }])

  return (
    <CRUDTable<Good>
      config={config}
      columns={columns}
      actions={[
        ...actions,
        {
          title: '更多操作',
          subActions: [
            {
              title: '打印',
              onClick() {},
            },
            {
              title: '其他',
              onClick() {},
            },
          ],
        },
      ]}
    />
  )
}
