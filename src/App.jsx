import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./admin-pages/AdminDashboard";
import PerformanceAD from "./admin-pages/PerformanceAD";
import { ToastContainer, Bounce } from 'react-toastify';
import InternationalDaysAD from "./admin-pages/InternationalDaysAD";
import FestivalAD from "./admin-pages/FestivalAD";
import AnnouncementsAD from "./admin-pages/AnnouncementsAD";
import Directory from "./pages/Directory";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./admin-components/AdminHeader";
import OrgChart from "./pages/OrgChart";
import EventLog from "./admin-pages/EventLog";

function App() {
  const location = useLocation();

  // Hide header & footer on login page and admin pages
  const hideLayout =
    location.pathname === "/" || location.pathname.startsWith("/admin-");

  const hideAdminLayout =
    location.pathname === "/" || !location.pathname.startsWith("/admin-");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      {!hideLayout && <Header />}
      {!hideAdminLayout && <AdminHeader />}

      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/employee/directory" element={<Directory />} />
        <Route path="/employee/orgChart" element={<OrgChart />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-performance" element={<PerformanceAD />} />
        <Route path="/admin-internationalDays" element={<InternationalDaysAD />} />
        <Route path="/admin-Festivals" element={<FestivalAD />} />
        <Route path="/admin-announcements" element={<AnnouncementsAD />} />
        <Route path="/admin-eventLog" element={<EventLog />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

// Wrap App with BrowserRouter
export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
