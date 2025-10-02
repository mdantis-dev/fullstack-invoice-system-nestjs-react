import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import type { Invoice, PagedInvoices } from '../../types'
import { isAxiosError } from 'axios'

export function useInvoices(page: number, limit: number) {
  return useQuery<PagedInvoices>({
    queryKey: ['invoices', page, limit],
    queryFn: async () => {
      const res = await api.get('/invoices', { params: { page, limit } })
      return res.data as PagedInvoices
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (!isAxiosError(error)) return failureCount < 1
      if (!error.response) return failureCount < 1 
      if (error.response.status >= 500) return failureCount < 2 
      return false
    },
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
    refetchOnWindowFocus: false,
    retry: (count, error) => {
      if (!isAxiosError(error)) return count < 1
      if (!error.response) return count < 1
      if (error.response.status >= 500) return count < 2
      return false
    },
  })
}
