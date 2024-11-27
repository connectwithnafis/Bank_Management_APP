import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlusCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import CircularJSON from 'circular-json';

const LoanDashboard = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [repaymentSchedules, setRepaymentSchedules] = useState([]);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log('No token found');
      return;
    }
    fetchPendingLoans();
  }, [token]);

  const fetchPendingLoans = async () => {
    try {
      const response = await axios.get('https://localhost:7000/api/Loans/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingLoans(response.data);
    } catch (error) {
      console.error('Error fetching pending loans:', error);
    }
  };
// const fetchPendingLoans = async () => {
//     try {
//         const response = await axios.get('https://localhost:7000/api/Loans/pending', {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         const parsedData = CircularJSON.parse(CircularJSON.stringify(response.data));
//         setPendingLoans(parsedData.$values); // Assuming loans are in $values
//     } catch (error) {
//         console.error('Error fetching pending loans:', error.message);
//     }
// };

  const handleApproveLoan = async (loanId) => {
    try {
      const response = await axios.post(
        `https://localhost:7000/api/Loans/approve/${loanId}`,
        { status: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Loan approved successfully!');
      fetchPendingLoans();
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleRejectLoan = async (loanId) => {
    try {
      const response = await axios.post(`https://localhost:7000/api/Loans/reject/${loanId}`,
        { status: 'Rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Loan rejected successfully!');
      fetchPendingLoans();
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  const handleViewRepaymentSchedule = async (loanId) => {
    try {
      const response = await axios.get(`api/Loans/repayment/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRepaymentSchedules(response.data);
      setSelectedLoan(loanId);
      setShowRepaymentModal(true);
    } catch (error) {
      console.error('Error fetching repayment schedule:', error);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '700px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Admin Loan Management</h2>

          {/* Pending Loan Applications */}
          <h4>Pending Loan Applications</h4>
          {pendingLoans.length > 0 ? (
            <ul className="list-group mb-4">
              {pendingLoans.map((loan) => (
                <li
                  key={loan.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{loan.fullName}</strong> - {loan.loanType} (${loan.loanAmount})
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApproveLoan(loan.id)}
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRejectLoan(loan.id)}
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending loans to review.</p>
          )}

          {/* Repayment Schedule Section */}
          <h4>Loan Repayment Schedules</h4>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/loanRepayments')}
          >
            View Repayment Schedules
          </button>

          {/* Repayment Schedule Modal */}
          {showRepaymentModal && (
            <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Repayment Schedule</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowRepaymentModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <ul>
                      {repaymentSchedules.map((schedule, index) => (
                        <li key={index}>
                          Payment Date: {schedule.date}, Amount: ${schedule.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowRepaymentModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;
