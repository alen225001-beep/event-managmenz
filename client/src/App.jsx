import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyPasses from './pages/MyPasses';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-gray-900 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route
                path="/my-passes"
                element={
                  <ProtectedRoute>
                    <MyPasses />
                  </ProtectedRoute>
                }
              />

              {/* Club Organizer & Admin Protected Routes */}
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* College Admin Console */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
