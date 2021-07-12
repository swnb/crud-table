import type { Actions } from './column-types'
import { Popover, Space } from 'antd'

export interface IActionButtonGroupProps<T> {
  actions: Actions<T>
  record: T
  direction?: 'vertical' | 'horizontal'
}

export function ActionButtonGroup<T>({ actions, record, direction }: IActionButtonGroupProps<T>) {
  return (
    <Space direction={direction}>
      {actions.map((action, index) => {
        if ('onClick' in action) {
          const onClick = () => {
            action.onClick(record)
          }
          return (
            <a key={index.toString()} onClick={onClick}>
              {action.title}
            </a>
          )
        }
        return (
          <Popover
            key={index.toString()}
            placement='bottom'
            content={
              <ActionButtonGroup direction='vertical' actions={action.subActions} record={record} />
            }
            trigger='hover'
          >
            <a>{action.title}</a>
          </Popover>
        )
      })}
    </Space>
  )
}
