import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import App from '../App';
import { publicRoute, privateRoutes } from './routes';
import { PageTransition } from '../components/PageTransition/PageTransition';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {publicRoute
          .filter((route) => route.path !== '/')
          .map((route) => {
            const Layout = route.layout;
            const Page = route.component;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PageTransition>
                    <Layout>
                      <Page />
                    </Layout>
                  </PageTransition>
                }
              />
            );
          })}
        {privateRoutes.map((route) => {
          const Layout = route.layout;
          const Page = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PageTransition>
                  <Layout>
                    <Page />
                  </Layout>
                </PageTransition>
              }
            />
          );
        })}
        {/* Everything not claimed by a legacy route falls through to the active Zustand-driven app */}
        <Route path="/*" element={<PageTransition><App /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

