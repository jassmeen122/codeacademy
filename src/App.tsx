
import { BrowserRouter as Router, Routes, Route, useRoutes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";

import Navigation from "./components/Navigation";
import { Toaster } from "sonner";
import { queryClient } from "./config/queryClient";
import { appRoutes } from "./routes/appRoutes";

const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation />
          <main className="pt-16 min-h-screen">
            <AppRoutes />
          </main>
          <Toaster position="top-right" closeButton />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
