import type { Options } from '../column-types'
import { Space, Tag } from 'antd'

export function createOptionsRender(key: string) {
  return (_: any, record: any) => {
    return (
      <Space>
        {((record[key] as Options) ?? []).map(({ label, value }) => (
          <Tag key={value}>{label}</Tag>
        ))}
      </Space>
    )
  }
}
