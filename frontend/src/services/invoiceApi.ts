import { apiFetch } from "./apiClient";

export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible";
export type InvoicePdfStatus = "ready" | "processing";

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  paidAt: string | null;
  pdfStatus: InvoicePdfStatus;
  paymentReference?: string;
}

export interface InvoiceDetail extends InvoiceSummary {
  subscriptionId: string;
  vietQrUrl?: string;
  bankDetails?: {
    bin: string;
    accountNumber: string;
    accountName: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    periodStart: string;
    periodEnd: string;
  }>;
}

interface InvoiceListResponse {
  success: boolean;
  data: InvoiceSummary[];
}

interface InvoiceDetailResponse {
  success: boolean;
  data: InvoiceDetail;
}

export const invoiceApi = {
  getInvoices: () => apiFetch<InvoiceListResponse>("/api/invoices"),
  getInvoice: (invoiceId: string) =>
    apiFetch<InvoiceDetailResponse>(`/api/invoices/${invoiceId}`),
  downloadPdf: async (invoice: InvoiceSummary) => {
    const token = localStorage.getItem("alsm_token");
    const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message || "Unable to download invoice PDF.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
