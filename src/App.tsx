
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import BusinessRegistrationPage from "./pages/BusinessRegistrationPage";
import CurrencyExchangePage from "./pages/CurrencyExchangePage";
import BusinessAnalyticsPage from "./pages/BusinessAnalyticsPage";
import BusinessAdvicePage from "./pages/BusinessAdvicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="register" element={<BusinessRegistrationPage />} />
            <Route path="currency" element={<CurrencyExchangePage />} />
            <Route path="analytics" element={<BusinessAnalyticsPage />} />
            <Route path="advice" element={<BusinessAdvicePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
