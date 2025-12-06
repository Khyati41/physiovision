import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhysioProvider } from "@/context/PhysioContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import DoctorSignIn from "./pages/auth/DoctorSignIn";
import DoctorSignUp from "./pages/auth/DoctorSignUp";
import PatientSignIn from "./pages/auth/PatientSignIn";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PhysioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/doctor/signin" element={<DoctorSignIn />} />
            <Route path="/doctor/signup" element={<DoctorSignUp />} />
            <Route path="/patient/signin" element={<PatientSignIn />} />
            
            {/* Protected Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute allowedUserType="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute allowedUserType="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PhysioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
