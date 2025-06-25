import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import TopNavbar from './components/Navbar/TopNavbar'
import SidebarNavbar from './components/Navbar/SideNavbar'
import Dashboard from './components/Dashboard/Dashboard'
import AuditPlan from './components/AuditPlan/AuditPlan' 
import NonConformity from './components/NonConformity/NonConformity'
import NonConformityButton from './components/NonConformity/NonConformityButtons'
import AuditPlanButton from './components/AuditPlan/AuditPlanButtons'
import User from './components/User/User'
import Footer from './components/Footer/Footer'


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
         <Route path='' element={<Home />} />
          {/* <Route path="/" element={<AuditTable />} />
          <Route path="/edit/:id" element={<AuditPlan />} /> */}
          <Route path="/Dashboard" element={<Dashboard />} />
           <Route path='AuditPlan' element={<AuditPlanButton />} />
          <Route path='NonConformity' element={<NonConformityButton/>} />
          <Route path='user/:userid' element={<User/>} />
          <Route path='xyz' element={<AuditPlan />} />
          <Route path='abc' element={<NonConformity />} />
          {/* ...other routes */}
        </Routes>
      </div>
    </div>
    <Footer />
    </>
  )
}
