/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableProps {
  table_heading: string
  columns: { key: string | number; label: string }[]
  data: any[]
  itemsPerPage: number
}
