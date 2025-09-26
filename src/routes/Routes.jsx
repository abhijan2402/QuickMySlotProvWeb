// routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SignUp from "../pages/Auth/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import ManageServicesPage from "../pages/ManageServices/ManageServicesPage";
import NotificationsPage from "../pages/NotificationsPage";
import Appointments from "../pages/Appointments";
import Support from "../pages/Support";
import ProfilePage from "../pages/ProfilePage";
import PricingModal from "../components/PricingModal";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import AppointmentDetails from "../pages/AppointmentDetails";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/manageshop" element={<ManageServicesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route
          path="/appointments_details/:id"
          element={<AppointmentDetails />}
        />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/pricing" element={<PricingModal />} />
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
