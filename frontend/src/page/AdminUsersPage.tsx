import { AdminLayout } from "../features/admin/AdminLayout";
import { UserManagementPage } from "../features/admin/UserManagementPage";

export function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagementPage />
    </AdminLayout>
  );
}
