import { useEffect } from "react";
import { useAppStore } from "./store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./page/LandingPage";
import { ConverterPage } from "./page/ConverterPage";
import { DataMappingPage } from "./page/DataMappingPage";
import { AuthGuidePage } from "./page/AuthGuidePage";
import { ArchitectureOverviewPage } from "./page/ArchitectureOverviewPage";
import { ModernizationFlowsPage } from "./page/ModernizationFlowsPage";
import { AiPromptEngineeringPage } from "./page/AiPromptEngineeringPage";
import { SignInPage } from "./page/SignInPage";
import { CreateAccountPage } from "./page/CreateAccountPage";
import { ProductExperiencePage } from "./page/ProductExperiencePage";
import { BookMeetingPage } from "./page/BookMeetingPage";
import { MyMeetingsPage } from "./page/MyMeetingsPage";
import { AdminDashboardPage } from "./page/AdminDashboardPage";
import { AdminUsersPage } from "./page/AdminUsersPage";
import { AdminUserDetailPage } from "./page/AdminUserDetailPage";
import { AdminMeetingsPage } from "./page/AdminMeetingsPage";
import { AdminConversionsPage } from "./page/AdminConversionsPage";
import { AdminReportsPage } from "./page/AdminReportsPage";
import { AdminSettingsPage } from "./page/AdminSettingsPage";

export default function App() {
  const { activePage, initAuth, session, setActivePage } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  const isAdmin = session.role === 'ADMIN';
  const isAdminPage = activePage.startsWith('admin-');

  // Admins never see the public site (Home, Solutions, Book a Meeting, ...).
  // Whenever an admin session lands on a non-admin page - right after
  // login, after initAuth restores the session on refresh, or if a stray
  // link/back-button navigation gets them off the admin pages - bounce
  // them straight back to the Admin Dashboard.
  useEffect(() => {
    if (isAdmin && !isAdminPage) {
      setActivePage('admin-dashboard');
    }
  }, [isAdmin, isAdminPage, setActivePage]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <LandingPage />;
      case 'converter':
        return <ConverterPage />;
      case 'data-mapping':
        return <DataMappingPage />;
      case 'auth-guide':
        return <AuthGuidePage />;
      case 'architecture-overview':
        return <ArchitectureOverviewPage />;
      case 'modernization-flows':
        return <ModernizationFlowsPage />;
      case 'ai-prompt-engineering':
        return <AiPromptEngineeringPage />;
      case 'product-experience':
        return <ProductExperiencePage />;
      case 'login':
        return <SignInPage />;
      case 'register':
        return <CreateAccountPage />;
      case 'book-meeting':
        return <BookMeetingPage />;
      case 'my-meetings':
        return <MyMeetingsPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-user-detail':
        return <AdminUserDetailPage />;
      case 'admin-meetings':
        return <AdminMeetingsPage />;
      case 'admin-conversions':
        return <AdminConversionsPage />;
      case 'admin-reports':
        return <AdminReportsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  if (isAdmin) {
    // Completely separate shell: no public Header/Footer. While the
    // redirect effect above is settling (isAdminPage still false right
    // after login), render nothing rather than flashing a user-facing page.
    if (!isAdminPage) return null;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900" id="admin-root-shell">
        {renderActiveView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" id="app-root-shell">
      <Header />

      <main className="flex-1 w-full bg-slate-55 flex flex-col">
        {renderActiveView()}
      </main>

      <Footer />
    </div>
  );
}
