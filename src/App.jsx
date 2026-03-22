import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}

function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public profile - anyone can view */}
        <Route path="/profile/:username" element={<PublicProfile />} />

        {/* Auth - only if not logged in */}
        <Route path="/auth" element={
          <PublicOnlyRoute><AuthPage /></PublicOnlyRoute>
        } />

        {/* Dashboard - only if logged in */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
