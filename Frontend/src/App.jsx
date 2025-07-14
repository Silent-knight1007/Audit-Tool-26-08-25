import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import AuthPanel from './components/Authorization/AuthPanel';
import ResetPassword from './components/Authorization/ResetPasswordpage';
import TopNavbar from './components/Navbar/TopNavbar';
import SidebarNavbar from './components/Navbar/SideNavbar';
import Dashboard from './components/Dashboard/Dashboard';
import AuditPlan from './components/AuditPlan/AuditPlan';
import AuditTable from './components/AuditPlan/AuditPlanTable';
import NonConformity from './components/NonConformity/NonConformity';
import NonConformityButton from './components/NonConformity/NonConformityButtons';
import AuditPlanButton from './components/AuditPlan/AuditPlanButtons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import User from './components/User/User';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/Authorization/ProtectedRoutes';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <SidebarNavbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="pt-16">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPanel />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } />
            <Route path="/auditplan" element={
              <ProtectedRoute>
                <AuditPlanButton />
              </ProtectedRoute>
            } />
            <Route path="/auditplantable" element={
              <ProtectedRoute>
                <AuditTable />
              </ProtectedRoute>
            } />
            <Route path="/nonconformity" element={
              <ProtectedRoute>
                <NonConformityButton />
              </ProtectedRoute>
            } />
            <Route path="/user/:userid" element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } />
            <Route path="/xyz" element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } />
            <Route path="/abc" element={
              <ProtectedRoute>
                <NonConformity />
              </ProtectedRoute>
            } />
            <Route path="/edit-audit/:id" element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } />
            <Route path="/edit-nc/:id" element={
              <ProtectedRoute>
                <NonConformity />
              </ProtectedRoute>
            } />
            {/* Add any additional protected routes below in the same pattern */}
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-center" />
      <Footer />
    </>
  );
}
