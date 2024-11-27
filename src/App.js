import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccountsList from './pages/components/AccountsList';
import AccountDetails from './pages/components/AccountDetails';
import EditAccount from './pages/components/EditAccount';
import Dashboard from './pages/Dashboard';
import AllAccounts from './pages/components/AllUserAccounts';
import LoanDashboard from './pages/components/LoanDashboard';
import LoanApplication from './pages/components/LoanApplication';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allAccounts" element={<AllAccounts />} />
        <Route path="/loanDashboard" element={<LoanDashboard />} />
        <Route path="/loanApplication" element={<LoanApplication />} />
        <Route path="/accounts" element={<AccountsList />} />
        <Route path="/account/details/:accountId" element={<AccountDetails />} />
        <Route path="/account/edit/:id" element={<EditAccount />} />
      </Routes>
    </Router>
  );
}

export default App;

