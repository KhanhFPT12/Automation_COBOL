import { AdminLayout } from "../features/admin/AdminLayout";
import { ConversionHistoryPage } from "../features/admin/ConversionHistoryPage";

export function AdminConversionsPage() {
  return (
    <AdminLayout>
      <ConversionHistoryPage />
    </AdminLayout>
  );
}
