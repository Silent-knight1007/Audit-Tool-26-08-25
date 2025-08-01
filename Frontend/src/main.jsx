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
import PolicyForm from './components/Organisationdocuments/Policies/PolicyForm.jsx'
import PolicyTable from './components/Organisationdocuments/Policies/PolicyTable.jsx'
import User from './components/User/User.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='*' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='Dashboard' element={<Dashboard />} />
      <Route path='AuditPlan' element={<AuditPlanButton />} />
      <Route path='NonConformity' element={<NonConformityButton />} />
      <Route path='user/:userid' element={<User />} />
      <Route path='xyz' element={<AuditPlan />} />
      <Route path='abc' element={<NonConformity />} />
      {/* Add these two: */}
      <Route path='edit-audit/:id' element={<AuditPlan />} />
      <Route path='edit-nc/:id' element={<NonConformity />} />
      

    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)