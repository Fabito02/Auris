import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/errors/404";
import Loading from "./components/loading/Loading";

const pageModules = import.meta.glob("./pages/**/*.tsx");

const Router: React.FC = () => {
  const routes = Object.entries(pageModules).map(([path, module]) => {
    const routePath = path
    .replace("./pages", "")
    .replace(/\.tsx$/, "")
    .replace(/\/index$/, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .toLowerCase();

    const Component = React.lazy(
      () => module() as Promise<{ default: React.ComponentType }>
    );

    return (
      <Route
        key={routePath}
        path={routePath}
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <Routes>
      {routes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
