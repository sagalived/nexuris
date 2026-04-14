import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { UserManagement } from './pages/admin/Users';
import { ActivityLogs } from './pages/admin/Logs';
import { ContractsPage } from './pages/admin/Contracts';
import { FinancialPage } from './pages/admin/Financial';
import { LegalPage } from './pages/admin/Legal';
import { ReportsPage } from './pages/admin/Reports';
import { TeamPage } from './pages/admin/Team';
import { IntelligencePage } from './pages/admin/Intelligence';
import { AlertsPage } from './pages/admin/Alerts';
import { ContractDetailsPage } from './pages/admin/ContractDetails';
import { LandingPage } from './pages/LandingPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/contracts" element={<ContractsPage />} />
              <Route path="/admin/financial" element={<FinancialPage />} />
              <Route path="/admin/legal" element={<LegalPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/team" element={<TeamPage />} />
              <Route path="/admin/intelligence" element={<IntelligencePage />} />
              <Route path="/admin/alerts" element={<AlertsPage />} />
              <Route path="/admin/contract-details" element={<ContractDetailsPage />} />
              
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
              <Route path="/admin/settings" element={<div className="p-8 text-white">Configurações (Em breve)</div>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
