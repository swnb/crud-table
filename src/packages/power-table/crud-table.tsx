import type { Actions, CRUDTableConfig } from './column-types'
import type { ProColumns } from '@ant-design/pro-table'
import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Button, Drawer, message } from 'antd'
import { useBoolean } from './utils'
import { ActionButtonGroup } from './action'
import { Fetcher } from '../power-request/fetcher'
import { EditForm } from './form'
import { confirm } from './tools/modal'

interface ICRUDTableProps<T> {
  config: CRUDTableConfig
  columns: ProColumns<T>[]
  style?: CSSProperties
  actions?: Actions<T>
}

export function CRUDTable<T extends { id: number }>({
  config,
  style,
  columns: baseColumns,
  actions: originActions,
}: ICRUDTableProps<T>) {
  const { query, drawer, remove } = config
  const [filterParams, setFilterParams] = useState<Record<string, unknown>>({})

  const requestCountRef = useRef(0)

  const { tableProps, run, params, refresh } = useRequest<T[]>(
    async ({ pageSize, current }, currentFilterParams: Record<string, unknown>) => {
      try {
        const response = await Fetcher.getInstance().get<{ data: T[]; total: number }>(query.url, {
          pageSize,
          current,
          ...currentFilterParams,
        })
        if (!response) return { list: [] as any[], total: 0 }
        const { data: list, total } = response
        return { list: list.map(v => ({ key: v.id, ...v })), total }
      } catch (err) {
        message.error(err)
      } finally {
        requestCountRef.current += 1
      }
    },
    { paginated: true },
  )

  useEffect(() => {
    if (requestCountRef.current >= 1) {
      run({ current: 1, pageSize: query.defaultPageSize }, filterParams)
    }
  }, [run, filterParams, query.defaultPageSize])

  const [opType, setOpType] = useState<'update' | 'create'>('create')
  const [currentActionRecord, setCurrentActionRecord] = useState<T | null>(null)
  const [drawerVisible, [setDrawerOpen, setDrawerHide]] = useBoolean()
  const [drawerTitle, setDrawerTitle] = useState(drawer?.title)

  const columns = useMemo(() => {
    if (originActions) {
      const actions = originActions.map(function actionMapper(action): Actions<T>[number] {
        if ('powerType' in action) {
          switch (action.powerType) {
            case 'delete': {
              const onClick = (record: T) => {
                const actionResult = action.onClick(record)
                if (typeof actionResult === 'boolean' && !actionResult) return

                const fetcher = Fetcher.getInstance()
                const confirmWrapper = confirm('确认删除？', null)
                confirmWrapper(async () => {
                  try {
                    await fetcher.delete(remove.url, { id: record.id })
                  } finally {
                    await run(...params)
                  }
                })
              }
              return { ...action, onClick }
            }
            case 'update': {
              return {
                ...action,
                onClick(record: T) {
                  const actionResult = action.onClick(record)
                  if (typeof actionResult === 'boolean' && !actionResult) return
                  setOpType('update')
                  setDrawerTitle('编辑')
                  setCurrentActionRecord(record)
                  setDrawerOpen()
                },
              }
            }
            default: {
              return action
            }
          }
        }

        if ('subActions' in action) {
          return {
            ...action,
            subActions: action.subActions.map(actionMapper),
          }
        }

        return action
      })

      const operate: ProColumns<T> = {
        title: '操作',
        key: 'option',
        width: config.actions.width,
        valueType: 'option',
        render(_: any, record: T) {
          return <ActionButtonGroup record={record} actions={actions} />
        },
      }
      return [...baseColumns, operate]
    }
    return baseColumns
  }, [baseColumns, config.actions.width, originActions, params, remove.url, run, setDrawerOpen])

  const handleAdd = useCallback(() => {
    setOpType('create')
    setDrawerTitle('新增')
    setCurrentActionRecord(null)
    setDrawerOpen()
  }, [setDrawerOpen])

  return (
    <>
      <ProTable<T>
        columns={columns}
        style={style}
        search={{}}
        onSubmit={setFilterParams}
        rowKey='id'
        toolBarRender={() => [
          <Button type='primary' key='primary' onClick={handleAdd}>
            新建
          </Button>,
        ]}
        {...tableProps}
      />
      <Drawer
        title={drawerTitle ?? ''}
        width={drawer?.width}
        visible={drawerVisible}
        onClose={setDrawerHide}
      >
        <EditForm<T>
          opType={opType}
          record={currentActionRecord}
          columns={columns}
          config={config}
          refresh={refresh}
          onClose={setDrawerHide}
        />
      </Drawer>
    </>
  )
}
