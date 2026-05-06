import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  Row,
} from '@tanstack/react-table'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Icon from '@components/shared/Icon'
import { TextField } from '@components/shared/TextField'
import { Select } from '@components/shared/Select'

export interface RowAction<T = any> {
  id: string
  label: string
  icon?: string
  onClick: (item: T, index: number) => void
  disabled?: (item: T) => boolean
  hidden?: (item: T) => boolean
  variant?: 'default' | 'destructive'
}

export interface TableProps<T = any> {
  data: T[]
  columns: ColumnDef<T>[]
  title?: string
  description?: string
  emptyMessage?: string
  searchable?: boolean
  searchPlaceholder?: string
  searchLabel?: string
  showRowActions?: boolean
  rowActions?: RowAction<T>[]
  onRowClick?: (item: T, index: number) => void
  enableRowSelection?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void
  onSelectedRowsChange?: (selectedRows: T[]) => void
  sorting?: SortingState
  onSortingChange?: (updater: SortingState | ((old: SortingState) => SortingState)) => void
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => void
  pagination?: PaginationState
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void
  className?: string
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

const RowActionsMenu = <T,>({
  actions,
  item,
  rowIndex,
  totalVisibleRows,
}: {
  actions: RowAction<T>[]
  item: T
  rowIndex: number
  totalVisibleRows: number
}) => {
  const visibleActions = actions.filter(action => !action.hidden?.(item))
  if (visibleActions.length === 0) return null

  const handleAction = (action: RowAction<T>, e: React.MouseEvent) => {
    e.stopPropagation()
    action.onClick(item, rowIndex)
  }

  const rowsFromEnd = totalVisibleRows - (rowIndex + 1)
  const shouldPositionUp = rowsFromEnd < 3 && totalVisibleRows >= 5
  const anchor = shouldPositionUp ? 'top end' : 'bottom end'
  const marginClass = shouldPositionUp ? 'mb-1' : 'mt-1'
  const originClass = shouldPositionUp ? 'origin-bottom-right' : 'origin-top-right'

  return (
    <Menu as="div" className="relative">
      <MenuButton
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-on-surface/8 transition-colors duration-200"
        aria-label="Acciones"
      >
        <Icon name="more_vert" size={20} className="text-on-surface-variant" />
      </MenuButton>

      <MenuItems
        transition
        anchor={anchor}
        className={`z-[9999] ${marginClass} w-48 ${originClass} rounded-lg bg-surface-container py-2 shadow-elevation-2 border border-outline-variant/12 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in focus:outline-none`}
      >
        {visibleActions.map((action) => {
          const isDisabled = action.disabled?.(item)
          return (
            <MenuItem key={action.id} disabled={isDisabled}>
              <button
                onClick={(e) => !isDisabled && handleAction(action, e)}
                disabled={isDisabled}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2 text-left text-sm transition-colors duration-200',
                  isDisabled
                    ? 'text-on-surface/38 cursor-not-allowed'
                    : action.variant === 'destructive'
                      ? 'text-error data-focus:bg-error-container'
                      : 'text-on-surface data-focus:bg-surface-container-highest'
                )}
              >
                {action.icon && <Icon name={action.icon} size={18} />}
                {action.label}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-16 text-center">
    <div className="flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-4">
        <Icon name="inbox" size={36} className="text-on-surface-variant opacity-50" />
      </div>
      <p className="text-sm font-medium text-on-surface">{message}</p>
    </div>
  </div>
)

const Pagination: React.FC<{ table: any; totalCount: number }> = ({ table, totalCount }) => {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  const startItem = pageIndex * pageSize + 1
  const endItem = Math.min((pageIndex + 1) * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/20">
      <span className="text-sm text-on-surface-variant">
        {startItem}–{endItem} de {totalCount}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-on-surface-variant">Filas:</span>
          <Select
            size="sm"
            value={String(pageSize)}
            onChange={(v) => table.setPageSize(Number(v))}
            options={[5, 10, 15, 20, 25, 50].map(s => ({ value: String(s), label: String(s) }))}
            className="w-20"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-full hover:bg-on-surface/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Primera página"
          >
            <Icon name="first_page" size={20} className="text-on-surface-variant" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-full hover:bg-on-surface/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Anterior"
          >
            <Icon name="chevron_left" size={20} className="text-on-surface-variant" />
          </button>
          <span className="text-sm text-on-surface px-2">
            {pageIndex + 1} / {pageCount}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-full hover:bg-on-surface/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Siguiente"
          >
            <Icon name="chevron_right" size={20} className="text-on-surface-variant" />
          </button>
          <button
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-full hover:bg-on-surface/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Última página"
          >
            <Icon name="last_page" size={20} className="text-on-surface-variant" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Table<T>({
  data,
  columns,
  title,
  description,
  emptyMessage = 'No hay datos disponibles',
  searchable = false,
  searchPlaceholder = 'Buscar...',
  searchLabel: _searchLabel = 'Buscar',
  showRowActions = false,
  rowActions = [],
  onRowClick,
  enableRowSelection = false,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
  onSelectedRowsChange,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  columnFilters: externalColumnFilters,
  onColumnFiltersChange: externalOnColumnFiltersChange,
  pagination: externalPagination,
  onPaginationChange: externalOnPaginationChange,
  className = '',
}: TableProps<T>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [globalFilter, setGlobalFilter] = React.useState('')

  const sorting = externalSorting ?? internalSorting
  const setSorting = externalOnSortingChange ?? setInternalSorting
  const columnFilters = externalColumnFilters ?? internalColumnFilters
  const setColumnFilters = externalOnColumnFiltersChange ?? setInternalColumnFilters
  const rowSelection = externalRowSelection ?? internalRowSelection
  const setRowSelection = externalOnRowSelectionChange ?? setInternalRowSelection
  const pagination = externalPagination ?? internalPagination
  const setPagination = externalOnPaginationChange ?? setInternalPagination

  const enhancedColumns = React.useMemo(() => {
    const base = [...columns]

    if (enableRowSelection) {
      base.unshift({
        id: 'select',
        header: ({ table }) => (
          <div className="px-1">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-outline text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface"
              checked={table.getIsAllRowsSelected()}
              ref={(el) => { if (el) el.indeterminate = table.getIsSomeRowsSelected() }}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-outline text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
        size: 50,
        enableSorting: false,
      })
    }

    if (showRowActions && rowActions.length > 0) {
      base.push({
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        cell: ({ row, table }) => {
          const visibleRows = table.getRowModel().rows
          const rowIndexInPage = visibleRows.findIndex(r => r.id === row.id)
          return (
            <RowActionsMenu
              actions={rowActions}
              item={row.original}
              rowIndex={rowIndexInPage}
              totalVisibleRows={visibleRows.length}
            />
          )
        },
      })
    }

    return base
  }, [columns, enableRowSelection, showRowActions, rowActions])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      ...(enableRowSelection && { rowSelection }),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    ...(enableRowSelection && { onRowSelectionChange: setRowSelection }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    enableSorting: true,
    enableFilters: true,
    enableGlobalFilter: searchable,
    enableRowSelection,
    manualPagination: false,
  })

  React.useEffect(() => {
    if (enableRowSelection && onSelectedRowsChange) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
      onSelectedRowsChange(selectedRows)
    }
  }, [rowSelection, enableRowSelection, onSelectedRowsChange])

  const handleRowClick = (row: Row<T>) => {
    if (onRowClick) onRowClick(row.original, row.index)
  }

  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-on-surface">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
          )}
        </div>
      )}

      <div className="rounded-xl shadow-[0_4px_12px_rgba(42,99,138,0.05)] border border-outline-variant/10 bg-surface-container-lowest overflow-visible">
        {searchable && (
          <div className="px-6 py-4 flex items-center border-b border-outline-variant/10">
            <div className="w-72">
              <TextField
                leadingIcon="search"
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
        )}

        {table.getRowModel().rows.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-surface-container-low">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          scope="col"
                          className={cn(
                            'py-3 px-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 transition-colors duration-200',
                            header.column.getCanSort() && 'cursor-pointer hover:bg-on-surface/8 select-none',
                            'first:pl-6 last:pr-6'
                          )}
                          style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="truncate">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {header.column.getCanSort() && (
                              <Icon
                                name={
                                  ({ asc: 'arrow_upward', desc: 'arrow_downward' } as Record<string, string>)[
                                    header.column.getIsSorted() as string
                                  ] ?? 'unfold_more'
                                }
                                size={16}
                                className="text-on-surface-variant opacity-70 shrink-0"
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody className="divide-y divide-outline-variant/10">
                  {table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className={cn(
                        'transition-colors duration-200',
                        row.getIsSelected()
                          ? 'bg-secondary-container'
                          : onRowClick
                            ? 'cursor-pointer hover:bg-surface-container-low'
                            : 'hover:bg-surface-container-low'
                      )}
                      onClick={() => handleRowClick(row)}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={cn(
                            'py-4 px-4 text-sm text-on-surface',
                            index === 0 && 'pl-6',
                            index === row.getVisibleCells().length - 1 && 'pr-6'
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination table={table} totalCount={data.length} />
          </>
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    </div>
  )
}

export type { ColumnDef, SortingState, ColumnFiltersState, PaginationState, RowSelectionState }
