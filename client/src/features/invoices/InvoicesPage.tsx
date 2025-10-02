import { useEffect, useRef, useState } from 'react'
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
  // Clamp page based on meta
  const pages = meta?.pages ?? 0
  const total = meta?.total ?? 0
  useEffect(() => {
    if (total === 0) {
      if (page !== 1) setPage(1)
    } else if (pages > 0 && page > pages) {
      setPage(pages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, total])

  // selection state for current page
  const [selected, setSelected] = useState<Set<number>>(new Set())
  // reset selection when page changes or invoices list changes
  useEffect(() => { setSelected(new Set()) }, [page, invoices.length])

  const allChecked = invoices.length > 0 && invoices.every(i => selected.has(i.id))
  const someChecked = invoices.some(i => selected.has(i.id)) && !allChecked
  const headerCbRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (headerCbRef.current) headerCbRef.current.indeterminate = someChecked
  }, [someChecked])

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set())
    } else {
      setSelected(new Set(invoices.map(i => i.id)))
    }
  }
  const toggleOne = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
          <div className="table-surface p-6 text-sm text-gray-500">Loading invoices…</div>
        ) : isError ? (
          <div className="table-surface p-6">
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Failed to load invoices.
            </div>
            <button className="btn-secondary" onClick={() => refetch()}>Retry</button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="table-surface p-6 text-sm text-gray-500">No invoices found.</div>
        ) : (
          <div className="table-surface">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] md:min-w-full text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="table-th w-10">
                      <input
                        ref={headerCbRef}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={allChecked}
                        onChange={toggleAll}
                      />
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
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selected.has(inv.id)}
                          onChange={() => toggleOne(inv.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="table-td" onClick={(e) => e.stopPropagation()}>{formatDate(inv.due_date)}</td>
                      <td className="table-td">{inv.vendor_name}</td>
                      <td className="table-td">{inv.description || '—'}</td>
                      <td className="table-td">{formatLongDate(inv.due_date)}</td>
                      <td className="table-td">{formatCurrency(inv.amount)}</td>
                      <td className="table-td">
                        {inv.paid ? (
                          <span className="status status-green">Paid</span>
                        ) : (
                          <span className="status status-red">Open</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
          <p className="col-span-2 sm:col-span-1 text-sm text-gray-600">
            Page <span className="font-medium">{total === 0 ? 0 : meta.page}</span> of{' '}
            <span className="font-medium">{pages}</span> — {total} total
          </p>

          <div className="justify-self-start sm:justify-self-auto flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={total === 0 || meta.page <= 1}
            >
              Prev
            </button>
            <button
              className="btn-secondary"
              onClick={() => setPage((p) => (pages > 0 ? Math.min(pages, p + 1) : p))}
              disabled={total === 0 || (pages > 0 ? meta.page >= pages : true)}
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
