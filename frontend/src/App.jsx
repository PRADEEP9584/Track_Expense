import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 lg:ml-64 transition-all duration-300 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root redirect handler
const RootRedirect = () => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return null;
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;