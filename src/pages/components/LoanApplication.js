import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

const LoanApplication = () => {
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  const handleLoanApplication = async () => {
    if (!loanType || !loanAmount || !loanTerm || !interestRate) {
      setMessage('Please fill out all fields');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7000/api/Loans/apply', 
        {
          loanType,
          loanAmount: parseFloat(loanAmount),
          loanTerm: parseInt(loanTerm),
          interestRate: parseFloat(interestRate),
          status: 'Loan Request',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.status === 200) {
        setMessage('Loan application submitted successfully!');
        setShowMessage(true);
        setTimeout(() => navigate('/dashboard'), 3000); // Redirect to dashboard
      }
    } catch (error) {
      console.error('Error applying for loan', error.response.data);
      setMessage(error.response.data.message || 'Something went wrong!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#4a4a4a' }}>
            Apply for Loan
          </h2>

          <div className="form-group mb-3">
            <label htmlFor="loanType">Loan Type</label>
            <input
              type="text"
              id="loanType"
              className="form-control"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              placeholder="Enter loan type (e.g., Personal, Home, Auto)"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="loanAmount">Loan Amount</label>
            <input
              type="number"
              id="loanAmount"
              className="form-control"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="loanTerm">Loan Term (in months)</label>
            <input
              type="number"
              id="loanTerm"
              className="form-control"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="Enter loan term in months"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              className="form-control"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleLoanApplication}
          >
            <FaMoneyBillWave className="me-2" /> Submit Application
          </button>

          {showMessage && (
            <div className="alert alert-info mt-3 text-center" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
