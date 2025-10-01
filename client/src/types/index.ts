export type Invoice = {
  id: number
  vendor_name: string
  amount: number
  due_date: string // ISO string
  paid: boolean
  description?: string | null
}

export type Meta = {
  page: number
  limit: number
  total: number
  pages: number
}

export type PagedInvoices = {
  data: Invoice[]
  meta?: Meta
}