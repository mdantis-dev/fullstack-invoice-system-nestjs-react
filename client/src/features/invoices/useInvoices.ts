import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import type { Invoice, PagedInvoices } from '../../types'

export function useInvoices(page: number, limit: number) {
  return useQuery<PagedInvoices>({
    queryKey: ['invoices', page, limit],
    queryFn: async () => {
      const res = await api.get('/invoices', { params: { page, limit } })
      return res.data as PagedInvoices
    },
    // v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
  })
}

export function useInvoice(id: number | null) {
  return useQuery<Invoice>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await api.get(`/invoices/${id}`)
      return res.data as Invoice
    },
    enabled: id !== null,
  })
}
