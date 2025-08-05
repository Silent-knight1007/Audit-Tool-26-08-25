import React, { useState } from 'react';
import { Routes, Route , Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import AuthPanel from './components/Authorization/AuthPanel';
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
import ProtectedRoute from './components/Authorization/ProtectedRoutes';
import PolicyForm from './components/Organisationdocuments/Policies/PolicyForm';
import PolicyTable from './components/Organisationdocuments/Policies/PolicyTable';
import GuidelineForm from './components/Organisationdocuments/Guidelines/GuidelineForm';
import GuidelineTable from './components/Organisationdocuments/Guidelines/GuidelineTable';
import TemplateForm from './components/Organisationdocuments/Templates/TemplateForm';
import TemplateTable from './components/Organisationdocuments/Templates/TemplateTable';
import CertificateForm from './components/Organisationdocuments/Certificates/Certificateform';
import CertificateTable from './components/Organisationdocuments/Certificates/CertificateTable';
import AdvisoryForm from './components/Organisationdocuments/Advisiories/AdvisoryForm';
import AdvisoryTable from './components/Organisationdocuments/Advisiories/AdvisoryTable';

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
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route
              path="/login"
              element={
              localStorage.getItem("isAuthenticated") === "true"
              ? <Navigate to="/home" replace />
              : <AuthPanel />
              }
            />

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
            
            <Route path="/organisationdocuments/policies" element={
              <ProtectedRoute>
                <PolicyTable />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/policies/new" element={
              <ProtectedRoute>
                <PolicyForm />
              </ProtectedRoute>
            }/>

            <Route path="/organisationdocuments/policies/:id" element={
              <ProtectedRoute>
                <PolicyForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/guidelines" element={
              <ProtectedRoute>
                <GuidelineTable />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/guidelines/new" element={
              <ProtectedRoute>
                <GuidelineForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/guidelines/:id" element={
              <ProtectedRoute>
                <GuidelineForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/templates" element={
              <ProtectedRoute>
                <TemplateTable />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/templates/new" element={
              <ProtectedRoute>
                <TemplateForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/templates/:id" element={
              <ProtectedRoute>
                <TemplateForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/certificates" element={
              <ProtectedRoute>
                <CertificateTable />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/certificates/new" element={
              <ProtectedRoute>
                <CertificateForm />
              </ProtectedRoute>
            } />

           <Route path="/organisationdocuments/certificates/:id" element={
              <ProtectedRoute>
                <CertificateForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/advisories" element={
              <ProtectedRoute>
                <AdvisoryTable />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/advisories/new" element={
              <ProtectedRoute>
                <AdvisoryForm />
              </ProtectedRoute>
            } />

            <Route path="/organisationdocuments/advisories/:id" element={
              <ProtectedRoute>
                <AdvisoryForm />
              </ProtectedRoute>
            } />
            
            {/* Add any additional protected routes below in the same pattern */}
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-center" />
      {/* <Footer /> */}
    </>
  );
}
