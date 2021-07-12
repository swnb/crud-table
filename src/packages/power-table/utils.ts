import type { Actions, CRUDTableConfig } from './column-types'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

export function useBoolean(initialState = false) {
  const [state, setState] = useState(initialState)

  const setTrue = useCallback(() => {
    setState(true)
  }, [])

  const setFalse = useCallback(() => {
    setState(false)
  }, [])

  const toggle = useCallback(() => {
    setState(preState => !preState)
  }, [])

  return [state, [setTrue, setFalse], toggle, setState] as const
}

export function initialDefaultPowerTableConfig(): CRUDTableConfig {
  return {
    form: {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    },
    query: {
      url: '',
      defaultPageIndex: 1,
      defaultPageSize: 10,
    },
    create: {
      url: '',
      method: 'POST',
      paramsJson: true,
    },
    update: {
      url: '',
      method: 'PUT',
      paramsJson: true,
    },
    remove: {
      url: '',
      method: 'DELETE',
    },
    drawer: {
      title: '',
      width: 500,
    },
    actions: {
      width: 150,
    },
  }
}

export function useInitialPowerTableConfig(commonURL?: string) {
  return useMemo(() => {
    const configs = initialDefaultPowerTableConfig()

    configs.create.url = commonURL ?? ''
    configs.query.url = commonURL ?? ''
    configs.remove.url = commonURL ?? ''
    configs.update.url = commonURL ?? ''

    return configs
  }, [commonURL])
}

type DefaultActionsArg<T> = {
  type?: 'update' | 'delete'
  title?: ReactNode
  onClick?: (record: T) => void
}[]
export function createDefaultActions<T>(defaultActions: DefaultActionsArg<T>): Actions<T> {
  return defaultActions.map(({ type, title, onClick }) => {
    switch (type) {
      case 'update': {
        return {
          title: title ?? '更新',
          powerType: 'update',
          onClick(record) {
            onClick?.(record)
          },
        }
      }
      case 'delete': {
        return {
          title: title ?? '删除',
          powerType: 'delete',
          onClick(record) {
            onClick?.(record)
          },
        }
      }
      default: {
        return {
          title: title ?? '未知操作',
          onClick(record) {
            onClick?.(record)
          },
        }
      }
    }
  })
}

export function useDefaultActions<T>(
  defaultActions: DefaultActionsArg<T> = [{ type: 'update' }, { type: 'delete' }],
) {
  return useMemo(() => createDefaultActions(defaultActions), [defaultActions])
}
