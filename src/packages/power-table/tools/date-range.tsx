import type { ProColumns } from '@ant-design/pro-table'

export function createDateRangeSearchColumn<T>(title: string): ProColumns<T> {
  return {
    title,
    dataIndex: 'dateRange',
    valueType: 'dateRange' as const,
    hideInTable: true,
    hideInForm: true,
    search: {
      transform(value: any) {
        const dateRange = value.map((v: string) => new Date(v).toISOString())
        return {
          startTime: dateRange[0],
          endTime: dateRange[1],
        }
      },
    },
  }
}
