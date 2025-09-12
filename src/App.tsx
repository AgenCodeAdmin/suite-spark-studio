import {
  Toaster
} from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "./pages/LandingPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

// Lazy-loaded components
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AccordionCrud = lazy(() => import("./pages/admin/AccordionCrud"));
const LogoCarouselCrud = lazy(() => import("./pages/admin/LogoCarouselCrud"));
const FaqCrud = lazy(() => import("./pages/admin/FaqCrud"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/accordion" element={<AccordionCrud />} />
              <Route path="/admin/logo-carousel" element={<LogoCarouselCrud />} />
              <Route path="/admin/faqs" element={<FaqCrud />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
