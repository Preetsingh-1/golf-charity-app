import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Subscription from "./pages/Subscription";
import Payment from "./pages/Payment";
import CharitySelection from "./pages/CharitySelection";
import CharityDirectory from "./pages/CharityDirectory";
import CharityDetails from "./pages/CharityDetails";
import Dashboard from "./pages/Dashboard";
import AddScore from "./pages/AddScore";
import DrawResults from "./pages/DrawResults";
import WinnerVerification from "./pages/WinnerVerification";
import ProfileSettings from "./pages/ProfileSettings";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDraw from "./pages/ManageDraw";
import VerifyWinners from "./pages/VerifyWinners";
import ManageCharities from "./pages/ManageCharities";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Draws from "./pages/Draws";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/charities" element={<CharityDirectory />} />
      <Route path="/charities/:id" element={<CharityDetails />} />
      <Route path="/draws" element={<Draws />} />

      {/* User */}
      <Route element={<ProtectedRoute />}>
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/charity-selection"
          element={<CharitySelection />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scores/add" element={<AddScore />} />
        <Route path="/draw-results" element={<DrawResults />} />
        <Route
          path="/winner-verification"
          element={<WinnerVerification />}
        />
        <Route path="/profile" element={<ProfileSettings />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route
          path="/admin/subscriptions"
          element={<Subscriptions />}
        />
        <Route path="/admin/draw" element={<ManageDraw />} />
        <Route
          path="/admin/charities"
          element={<ManageCharities />}
        />
        <Route
          path="/admin/winners"
          element={<VerifyWinners />}
        />
        <Route path="/admin/reports" element={<Reports />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;