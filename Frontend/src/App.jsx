import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import AuthPanel from './components/Authorization/AuthPanel'
import ResetPassword from './components/Authorization/ResetPasswordpage'
import TopNavbar from './components/Navbar/TopNavbar'
import SidebarNavbar from './components/Navbar/SideNavbar'
import Dashboard from './components/Dashboard/Dashboard'
import AuditPlan from './components/AuditPlan/AuditPlan' 
import AuditTable from './components/AuditPlan/AuditPlanTable'
import NonConformity from './components/NonConformity/NonConformity'
import NonConformityButton from './components/NonConformity/NonConformityButtons'
import AuditPlanButton from './components/AuditPlan/AuditPlanButtons'
import User from './components/User/User'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/Authorization/ProtectedRoutes'

export default function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
     <div>
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
      <SidebarNavbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content with top padding (for fixed top navbar) */}
      <div className="pt-16">
        <Routes>
          {/* Public route */}
          <Route path='' element={<Home />} />

          {/* All other routes are protected */}
          <Route 
            path='login' 
            element={
                <AuthPanel/>
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AuditTable />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='AuditPlan' 
            element={
              <ProtectedRoute>
                <AuditPlanButton />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='NonConformity' 
            element={
              <ProtectedRoute>
                <NonConformityButton/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='user/:userid' 
            element={
              <ProtectedRoute>
                <User/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='xyz' 
            element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='abc' 
            element={
              <ProtectedRoute>
                <NonConformity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-audit/:id" 
            element={
              <ProtectedRoute>
                <AuditPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-nc/:id" 
            element={
              <ProtectedRoute>
                <NonConformity />
              </ProtectedRoute>
            } 
          />
          {/* ...other routes */}
        </Routes>
      </div>
    </div>
    <Footer />
    </>
  )
}