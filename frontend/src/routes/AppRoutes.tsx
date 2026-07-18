import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { publicRoute, privateRoutes } from './routes';

export default function AppRoutes() {
  return (
    <Routes>
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
                <Layout>
                  <Page />
                </Layout>
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
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
      {/* Everything not claimed by a legacy route falls through to the active Zustand-driven app */}
      <Route path="/*" element={<App />} />
    </Routes>
  );
}
