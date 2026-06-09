<<<<<<< HEAD
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
=======
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoute } from "./routes";
import { useSelector } from "react-redux";

import { type RootState } from "./features/store";
import DefaultLayout from "./layouts/DefaultLayout";
import PageNotFound from "./pages/PageNotFound";
function App() {
  const token = useSelector((state: RootState) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        {publicRoute.map((route, index) => {
          const Page = route.component;
          let Layout = route.layout;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {token.token &&
          privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = route.layout;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        <Route
          path={"*"}
          element={
            <DefaultLayout>
              <PageNotFound />
            </DefaultLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 60850e00fbce3e9515348b053d6dae59ae045d71
