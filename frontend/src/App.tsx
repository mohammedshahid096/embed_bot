import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes, type RouteConfig } from "../src/view/routes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ContextProvider from "./context/ContextProvider";

function App() {
  return (
    <ContextProvider>
      <TooltipProvider>
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
      </TooltipProvider>
    </ContextProvider>
  );
}

export default App;
