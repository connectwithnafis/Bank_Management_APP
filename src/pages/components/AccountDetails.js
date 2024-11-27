import React, { useEffect, useState } from 'react';
import axios from '../../../src/axiosConfig';
import { useParams } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWallet, FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AccountDetails = () => {
  const { accountId } = useParams(); 
  const [accountDetails, setAccountDetails] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7000/api/Accounts/${accountId}/Details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccountDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details', error);
      }
    };

    if (token) {
      fetchAccountDetails();
    }
  }, [accountId, token]);

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: 'bold' }}>Account Details</h3>

      {accountDetails ? (
        <div className="card p-4 shadow-lg rounded-lg" style={{ backgroundColor: '#fff', borderRadius: '20px' }}>
          <div className="mb-4">
            <h5 className="text-primary">
              <strong>Account Type:</strong> {accountDetails.accountType}
            </h5>
          </div>
          
          <div className="mb-4">
            <h6 className="text-success">
              <strong>Balance:</strong> ${accountDetails.balance.toFixed(2)}
            </h6>
          </div>

          <div className="mb-4">
            <h6 className="text-info">
              <strong>Recent Transactions:</strong>
            </h6>
            <ul className="list-group">
              {accountDetails.transactions.map((transaction) => (
                <li key={transaction.id} className={`list-group-item d-flex justify-content-between align-items-center ${transaction.transactionType === 'Deposit' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                  <span>
                    <strong>{new Date(transaction.date).toLocaleDateString('en-GB')}:</strong> {transaction.transactionType} of ${transaction.amount}
                  </span>
                  {transaction.transactionType === 'Deposit' ? (
                    <FaArrowDown className="text-white" />
                  ) : (
                    <FaArrowUp className="text-white" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button className="btn btn-primary w-100 mt-4" onClick={() => window.history.back()}>
              <FaWallet className="me-2" /> Go Back to Accounts
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading account details...</p>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
