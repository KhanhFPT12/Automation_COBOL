import { useEffect } from "react";
import { useAppStore } from "./store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./page/LandingPage";
import { ConverterPage } from "./page/ConverterPage";
import { DataMappingPage } from "./page/DataMappingPage";
import { AuthGuidePage } from "./page/AuthGuidePage";
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
  const { activePage, initAuth } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

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
