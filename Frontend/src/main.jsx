import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from './App.jsx'
import Home from './components/Home/Home.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import AuditPlan from './components/AuditPlan/AuditPlan.jsx'
import NonConformity from './components/NonConformity/NonConformity.jsx'
import AuditPlanButton from './components/AuditPlan/AuditPlanButtons.jsx'
import NonConformityButton from './components/NonConformity/NonConformityButtons.jsx'
import User from './components/User/User.jsx'

// ✅ Import AuthProvider
import { AuthProvider } from './context/AuthContext.jsx' // make sure path matches your actual folder/file

// Routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<App />}>
      {/* Public */}
      <Route path="" element={<Home />} />
      {/* Protected (example, adjust as needed) */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="auditplan" element={<AuditPlanButton />} />
      <Route path="nonconformity" element={<NonConformityButton />} />
      <Route path="user/:userid" element={<User />} />
      <Route path="xyz" element={<AuditPlan />} />
      <Route path="abc" element={<NonConformity />} />
      <Route path="edit-audit/:id" element={<AuditPlan />} />
      <Route path="edit-nc/:id" element={<NonConformity />} />
    </Route>
  )
)

// ✅ Wrap the whole app with AuthProvider so useContext works
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
