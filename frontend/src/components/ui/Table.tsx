import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface Pagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pagination?: Pagination;
  dense?: boolean;
}

export default function Table<T extends { id?: number | string }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found.",
  onRowClick,
  pagination,
  dense = false,
}: TableProps<T>) {
  const cellPad = dense ? "px-3 py-2" : "px-4 py-3";
  if (loading) {
    return (
      <div className="card-base overflow-hidden">
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-block h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-base p-12 text-center">
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-page/50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`${cellPad} font-semibold text-text-muted`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border-subtle last:border-0 ${
                  onRowClick ? "cursor-pointer hover:bg-bg-page/50" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={`${cellPad} text-text-primary`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between border-t border-border-subtle px-3 py-2">
          <span className="text-xs text-text-muted">
            Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
