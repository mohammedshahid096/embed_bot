import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes, type RouteConfig } from "../src/view/routes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route>
            {routes.map((route: RouteConfig, index: number) => {
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
