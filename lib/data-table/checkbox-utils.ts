import type { Table } from "@tanstack/react-table"

export function getSelectAllCheckboxProps<T>(table: Table<T>) {
  const allSelected = table.getIsAllPageRowsSelected()
  const someSelected = table.getIsSomePageRowsSelected()

  return {
    checked: allSelected,
    indeterminate: someSelected && !allSelected,
  }
}

export function getGroupCheckboxProps(selectedCount: number, totalCount: number) {
  const allSelected = totalCount > 0 && selectedCount === totalCount
  const someSelected = selectedCount > 0 && selectedCount < totalCount

  return {
    checked: allSelected,
    indeterminate: someSelected,
  }
}
