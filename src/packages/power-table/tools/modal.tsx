import type { Fn } from '../../types'
import type { ReactNode } from 'react'
import { Modal } from 'antd'

export function confirm(
  title: ReactNode,
  content: ReactNode,
): Fn<[Fn<[], Promise<void>>], Promise<void>> {
  return async (task: Fn<[], Promise<void>>) => {
    return new Promise<void>((res, rej) => {
      const onOk = async () => {
        try {
          await task()
          res()
        } catch {
          rej()
        }
      }
      Modal.confirm({
        title,
        content,
        onOk() {
          return onOk()
        },
        onCancel() {
          rej()
        },
        okText: '确认',
        cancelText: '取消',
      })
    })
  }
}
