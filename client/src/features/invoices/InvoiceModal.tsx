import { useInvoice } from './useInvoices'

export default function InvoiceModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { data, isLoading, isError, refetch } = useInvoice(id)

  function formatCurrency(n: number, currency = 'USD') {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n) }
    catch { return n.toFixed(2) }
  }
  function formatDate(iso: string) {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="card w-full max-w-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-base font-semibold">Invoice #{id}</h3>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>

          <div className="p-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : isError ? (
              <div>
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Failed to load invoice.
                </div>
                <button className="btn-secondary" onClick={() => refetch()}>Retry</button>
              </div>
            ) : data ? (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Vendor</div>
                  <div className="col-span-2 font-medium">{data.vendor_name}</div>

                  <div className="text-gray-500">Amount</div>
                  <div className="col-span-2 font-medium">{formatCurrency(data.amount)}</div>

                  <div className="text-gray-500">Due date</div>
                  <div className="col-span-2">{formatDate(data.due_date)}</div>

                  <div className="text-gray-500">Paid</div>
                  <div className="col-span-2">
                    {data.paid ? (
                      <span className="badge badge-green">paid</span>
                    ) : (
                      <span className="badge badge-red">unpaid</span>
                    )}
                  </div>
                </div>

                {data.description && (
                  <div>
                    <div className="text-gray-500 mb-1">Description</div>
                    <p className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      {data.description}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}