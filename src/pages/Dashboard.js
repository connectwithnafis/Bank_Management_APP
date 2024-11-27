import React, { useEffect, useState } from 'react';
import axios from '../../src/axiosConfig';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWallet, FaHistory, FaDollarSign, FaExternalLinkAlt,FaPlusCircle, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [isExternal, setIsExternal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7000/api/User/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    if (token) {
      fetchData();
    } else {
      console.log('No token found');
    }
  }, [token]);

  const handleViewAccountDetails = (userId) => navigate(`/account/details/${userId}`);

  const handleShowBalance = async () => {
    try {
      const response = await axios.get(`https://localhost:7000/api/User/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance', error.response.data);
    }
  };

  const handleToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeposit = async () => {
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        handleToast('Please enter a valid amount!');
        return;
      }
      const response = await axios.post(
        'https://localhost:7000/api/Transactions/deposit',
        { transactionType: 'Deposit', amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleToast('Deposit successful!');
      handleShowBalance();
      setAmount('');
    } catch (error) {
      console.error('Error depositing funds', error.response.data);
      handleToast(error.response.data);
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7000/api/Transactions/withdraw',
        { transactionType: 'Withdrawal', amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleToast('Withdrawal successful!');
      handleShowBalance();
      setAmount('');
    } catch (error) {
      console.error('Error withdrawing funds', error.response.data);
      handleToast(error.response.data);
    }
  };

  const handleTransfer = async () => {
    try {
      if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
        handleToast('Please enter a valid transfer amount!');
        return;
      }
      if (!recipientAccountId || isNaN(recipientAccountId)) {
        handleToast('Please enter a valid recipient account ID!');
        return;
      }

      const feeRate = 1.5 / 100;
      const transactionFee = parseFloat(transferAmount) * feeRate;
      const totalAmount = parseFloat(transferAmount) + transactionFee;

      const payload = {
        transactionType: 'Transfer',
        amount: parseFloat(transferAmount),
        recipientAccountId: parseFloat(recipientAccountId),
        isExternal: isExternal,
      };

      const response = await axios.post('https://localhost:7000/api/Transactions/transfer', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleToast(`Transfer successful! Fee applied: $${transactionFee.toFixed(2)}`);
      handleShowBalance();
      setTransferAmount('');
      setRecipientAccountId('');
    } catch (error) {
      console.error('Error transferring funds', error.response.data);
      handleToast(error.response.data);
    }
  };

  const fetchPendingAccounts = async () => {
    try {
      const response = await axios.get('https://localhost:7000/api/Accounts/ApproveAccounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.data.length=== 0) {
        handleToast('No pending accounts found.');
      }
      setPendingAccounts(response.data);
    } catch (error) {
      console.error('Error fetching pending accounts', error);
      handleToast('Failed to fetch pending accounts.');
    }
  };

  const approvePendingAccount = async (accountId) => {
    try {
      const response = await axios.post(
        `https://localhost:7000/api/Accounts/ApprovePendingAccounts/${accountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        handleToast('Account approved successfully!');
        fetchPendingAccounts();
      } else {
        handleToast(response.data);
      }
    } catch (error) {
      console.error('Error approving account:', error.response.data);
      handleToast(error.response.data);
    }
  };
  

  return (
    <div className="container py-5" style={{ backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#4a4a4a' }}>
            Welcome to Bank Portal
          </h2>
          {userData ? (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="h5">
                  Hello, <strong>{userData.username}</strong>
                </p>
                <span className="badge bg-primary">{userData.role}</span>
                <div className="d-flex align-items-center">
                <button
                      className="btn btn-sm btn-primary flex-grow-1 me-2 d-flex align-items-center justify-content-center"
                      onClick={() => navigate('/loanApplication')}
                    >
                      <FaHistory className="me-2" /> Apply for Loan
                    </button>
                </div>
                
              </div>
              {userData.role === 'Customer' ? (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <button
                      className="btn btn-primary flex-grow-1 me-2 d-flex align-items-center justify-content-center"
                      onClick={() => handleViewAccountDetails(userData.userId)}
                    >
                      <FaHistory className="me-2" /> Transaction History
                    </button>
                    <button
                      className="btn btn-secondary flex-grow-1 ms-2 d-flex align-items-center justify-content-center"
                      onClick={handleShowBalance}
                    >
                      <FaDollarSign className="me-2" /> Show Balance
                    </button>
                  </div>

                  {balance !== null && (
                    <div className="mt-3 text-center">
                      <h5>
                        Current Balance: <span className="text-success">${balance.toFixed(2)}</span>
                      </h5>
                    </div>
                  )}
                  <div className="mt-4">
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <div className="d-flex justify-content-between mb-3">
                      <button
                        className="btn btn-success flex-grow-1 me-2 d-flex align-items-center justify-content-center"
                        onClick={handleDeposit}
                      >
                        <FaWallet className="me-2" /> Deposit
                      </button>
                      <button
                        className="btn btn-danger flex-grow-1 ms-2 d-flex align-items-center justify-content-center"
                        onClick={handleWithdraw}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="Transfer Amount"
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={recipientAccountId}
                      onChange={(e) => setRecipientAccountId(e.target.value)}
                      placeholder="Recipient Account No."
                    />
                    <label className="form-check-label mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={isExternal}
                        onChange={(e) => setIsExternal(e.target.checked)}
                      />
                      External Transfer
                    </label>
                    <button className="btn btn-warning w-100 d-flex align-items-center justify-content-center" onClick={handleTransfer}>
                      <FaExternalLinkAlt className="me-2" /> Transfer Funds
                    </button>
                  </div>
                </>
              ) : (
                <div className='d-flex justify-content-between mb-3'>
                  <button 
                    className="btn btn-primary flex-grow-1 me-2 align-items-center justify-content-center" 
                    onClick={() => navigate('/allAccounts')}
                    style={{
                      borderRadius: '8px', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <FaExternalLinkAlt className="me-2" /> View All Accounts
                  </button>

                  <button 
                    className="btn btn-primary flex-grow-1 me-2 align-items-center justify-content-center" 
                    onClick={() => navigate('/loanDashboard')}
                    style={{
                      borderRadius: '8px', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <FaExternalLinkAlt className="me-2" /> Loan Dashboard
                  </button>

                  <button 
                    className="btn btn-success flex-grow-1 ms-2 align-items-center justify-content-center" 
                    onClick={() => navigate('/signup')}
                    style={{
                      borderRadius: '8px', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <FaPlusCircle className="me-2" /> Create Account
                  </button>

                  <button 
                    className="btn btn-warning flex-grow-1 ms-2 align-items-center justify-content-center"
                    onClick={fetchPendingAccounts}
                  >
                    <FaUsers className="me-2" /> Pending Accounts
                  </button>
                </div>

              )}
              {pendingAccounts.length > 0 && (
                <div className="mt-4">
                  <h5>Pending Accounts</h5>
                  <ul className="list-group">
                    {pendingAccounts.map((account, index) => (
                      <li className="list-group-item d-flex justify-content-between" key={index}>
                        {account.username}
                        <button className="btn btn-success btn-sm" onClick={() => approvePendingAccount(account.id)}>Approve</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-success text-white">
            <div className="toast-body">{toastMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
