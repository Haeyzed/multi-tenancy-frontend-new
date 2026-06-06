"use client"

import type { Table } from "@tanstack/react-table"
import { Trash2Icon, XIcon } from "lucide-react"
import * as React from "react"

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar"
import type { Tenant } from "@/types/central/tenant"

interface TenantActionBarProps {
  table: Table<Tenant>
}

export function TenantActionBar({ table }: TenantActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table],
  )

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        {rows.length} selected
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <ActionBarItem onClick={() => table.toggleAllRowsSelected(false)}>
          Clear selection
        </ActionBarItem>
        <ActionBarItem variant="destructive">
          <Trash2Icon />
          Delete
        </ActionBarItem>
        <ActionBarClose>
          <XIcon />
        </ActionBarClose>
      </ActionBarGroup>
    </ActionBar>
  )
}
