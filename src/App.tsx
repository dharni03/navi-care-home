import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthGuard from "@/components/AuthGuard";
import Doctors from "@/pages/Doctors";
import Appointments from "@/pages/Appointments";
import EmergencyAlerts from "@/pages/EmergencyAlerts";
import BookAppointment from "@/pages/BookAppointment";
import Profile from "@/pages/Profile";
import Patients from "@/pages/Patients";
import Home from "@/pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/doctors" element={<AuthGuard><Doctors /></AuthGuard>} />
          <Route path="/appointments" element={<AuthGuard><Appointments /></AuthGuard>} />
          <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/patients" element={<AuthGuard><Patients /></AuthGuard>} />
          <Route path="/emergency" element={<AuthGuard><EmergencyAlerts /></AuthGuard>} />
          <Route path="/book" element={<AuthGuard><BookAppointment /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
