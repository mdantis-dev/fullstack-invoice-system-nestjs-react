import { useState } from 'react'
import { useInvoices } from './useInvoices'
import InvoiceModal from './InvoiceModal'
import type { Invoice } from '../../types'

function formatCurrency(n: number, currency = 'USD') {
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n) }
  catch { return n.toFixed(2) }
}
function formatDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(d)
}
function formatLongDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(d)
}

export default function InvoicesPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data, isLoading, isError, refetch, isFetching } = useInvoices(page, limit)
  const invoices = data?.data ?? []
  const meta = data?.meta

  const open = (inv: Invoice) => setSelectedId(inv.id)
  const close = () => setSelectedId(null)

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">Click a row to view details.</p>
        </div>
        {isFetching && <span className="text-xs text-gray-500">Refreshing…</span>}
      </div>

      <div className="table-surface">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading invoices…</div>
        ) : isError ? (
          <div className="p-6">
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Failed to load invoices.
            </div>
            <button className="btn-secondary" onClick={() => refetch()}>Retry</button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head">
                <tr>
                  <th className="table-th w-10">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Payee</th>
                  <th className="table-th">Description</th>
                  <th className="table-th">Due Date</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => open(inv)}
                  >
                    <td className="table-td">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>
                    <td className="table-td">{formatDate(inv.due_date)}</td>
                    <td className="table-td">{inv.vendor_name}</td>
                    <td className="table-td">{inv.description || '—'}</td>
                    <td className="table-td">{formatLongDate(inv.due_date)}</td>
                    <td className="table-td">{formatCurrency(inv.amount)}</td>
                    <td className="table-td">
                      {inv.paid ? (
                        <span className="badge badge-green">paid</span>
                      ) : (
                        <span className="badge badge-red">open</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page <span className="font-medium">{meta.page}</span> of <span className="font-medium">{meta.pages}</span> — {meta.total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
            >
              Prev
            </button>
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => (meta.pages ? Math.min(meta.pages, p + 1) : p + 1))}
              disabled={meta.pages ? meta.page >= meta.pages : false}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedId !== null && <InvoiceModal id={selectedId} onClose={close} />}
    </div>
  )
}
