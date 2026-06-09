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
      case 'login':
        return <SignInPage />;
      case 'register':
        return <CreateAccountPage />;
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