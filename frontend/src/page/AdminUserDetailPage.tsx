import { AdminLayout } from "../features/admin/AdminLayout";
import { UserDetailPage as UserDetailFeature } from "../features/admin/UserDetailPage";

export function AdminUserDetailPage() {
  return (
    <AdminLayout>
      <UserDetailFeature />
    </AdminLayout>
  );
}
