import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Subscription from "./pages/Subscription";
import CharitySelection from "./pages/CharitySelection";
import Dashboard from "./pages/Dashboard";
import AddScore from "./pages/AddScore";
import DrawResults from "./pages/DrawResults";
import WinnerVerification from "./pages/WinnerVerification";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDraw from "./pages/ManageDraw";
import VerifyWinners from "./pages/VerifyWinners";
import ManageCharities from "./pages/ManageCharities";

// import Payment from "./pages/Payment";
// import CharityDirectory from "./pages/CharityDirectory";
// import CharityDetails from "./pages/CharityDetails";
// import ProfileSettings from "./pages/ProfileSettings";

// import Users from "./pages/Users";
// import Subscriptions from "./pages/Subscriptions";
// import Reports from "./pages/Reports";

import AdminLayout from "./components/AdminLayout";
import Payment from "./pages/Payment";
import CharityDirectory from "./pages/CharityDirectory";
import CharityDetails from "./pages/CharityDetails";
import ProfileSettings from "./pages/ProfileSettings";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ================= USER ================= */}

      <Route path="/subscription" element={<Subscription />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/charity-selection" element={<CharitySelection />} />

      <Route path="/charities" element={<CharityDirectory />} />
      <Route path="/charities/:id" element={<CharityDetails />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/scores/add" element={<AddScore />} />
      <Route path="/draw-results" element={<DrawResults />} />
      <Route
        path="/winner-verification"
        element={<WinnerVerification />}
      />
      <Route path="/profile" element={<ProfileSettings />} />

      {/* ================= ADMIN LOGIN ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN PANEL ================= */}

      <Route path="/admin" element={<AdminLayout />}>

        {/* /admin */}
        <Route index element={<AdminDashboard />} />

        {/* /admin/users */}
        <Route path="users" element={<Users />} />

        {/* /admin/subscriptions */}
        <Route
          path="subscriptions"
          element={<Subscriptions />}
        />

        {/* /admin/draw */}
        <Route path="draw" element={<ManageDraw />} />

        {/* /admin/charities */}
        <Route
          path="charities"
          element={<ManageCharities />}
        />

        {/* /admin/winners */}
        <Route
          path="winners"
          element={<VerifyWinners />}
        />

        {/* /admin/reports */}
        <Route
          path="reports"
          element={<Reports />}
        />

      </Route>

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;