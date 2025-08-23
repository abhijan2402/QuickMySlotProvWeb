// routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import NotFound from "../pages/NotFound";
import ServicesPage from "../pages/ServicesPage";

import ProfilePage from "../pages/ProfilePage";
import Appointments from "../pages/Appointments";

import Support from "../pages/Support";
import ManageServicesPage from "../pages/ManageServices/ManageServicesPage";
import NotificationsPage from "../pages/NotificationsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Routes WITH Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/manageshop" element={<ManageServicesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
