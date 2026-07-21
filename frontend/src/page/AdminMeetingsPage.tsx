import { AdminLayout } from "../features/admin/AdminLayout";
import { MeetingManagementPage } from "../features/admin/MeetingManagementPage";

export function AdminMeetingsPage() {
  return (
    <AdminLayout>
      <MeetingManagementPage />
    </AdminLayout>
  );
}
