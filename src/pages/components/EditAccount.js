import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditAccount = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    role: '',
    password: '',
    accounts: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:7000/api/Accounts/GetUserById/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setError('No token found. Please log in.');
      setLoading(false);
    }
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...userData.accounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    setUserData((prev) => ({ ...prev, accounts: updatedAccounts }));
  };

  const handleTransactionChange = (accountIndex, transactionIndex, field, value) => {
    const updatedAccounts = [...userData.accounts];
    const updatedTransactions = [...updatedAccounts[accountIndex].transactions];
    updatedTransactions[transactionIndex] = { ...updatedTransactions[transactionIndex], [field]: value };
    updatedAccounts[accountIndex].transactions = updatedTransactions;
    setUserData((prev) => ({ ...prev, accounts: updatedAccounts }));
  };

  const toggleEditMode = (accountIndex, transactionIndex) => {
    const updatedAccounts = [...userData.accounts];
    updatedAccounts[accountIndex].transactions[transactionIndex].isEditing = !updatedAccounts[accountIndex].transactions[transactionIndex].isEditing;
    setUserData((prev) => ({ ...prev, accounts: updatedAccounts }));
  };

  const formatAmount = (amount) => {
    return `৳ ${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7000/api/Accounts/EditUser/${id}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(response.data); 
      navigate('/allAccounts'); 
    } catch (err) {
      alert('Failed to update user. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={userData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            className="form-control"
            value={userData.role}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password (optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>
        <h4 className="mt-4">Accounts</h4>
        {userData.accounts.map((account, accountIndex) => (
          <div key={accountIndex} className="border rounded p-3 mb-3">
            <div className="mb-2">
              <label htmlFor={`accountType-${accountIndex}`} className="form-label">Account Type</label>
              <select
                id={`accountType-${accountIndex}`}
                className="form-select"
                value={account.accountType || ''}
                onChange={(e) => handleAccountChange(accountIndex, 'accountType', e.target.value)}
              >
                <option value="Current">Current</option>
                <option value="Savings">Savings</option>
                <option value="Loan">Loan</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor={`balance-${accountIndex}`} className="form-label">Balance</label>
              <input
                type="number"
                id={`balance-${accountIndex}`}
                className="form-control"
                value={account.balance || 0}
                onChange={(e) => handleAccountChange(accountIndex, 'balance', e.target.value)}
              />
            </div>
            <h5 className="mt-3">Transactions</h5>
            <ul className="list-group">
              {account.transactions.map((transaction, transactionIndex) => (
                <li key={transactionIndex} className="list-group-item d-flex justify-content-between align-items-center">
                  {transaction.isEditing ? (
                    <div>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={transaction.transactionType || ''}
                        onChange={(e) => handleTransactionChange(accountIndex, transactionIndex, 'transactionType', e.target.value)}
                        placeholder="Transaction Type"
                      />
                      <input
                        type="number"
                        className="form-control mb-2"
                        value={transaction.amount || 0}
                        onChange={(e) => handleTransactionChange(accountIndex, transactionIndex, 'amount', e.target.value)}
                        placeholder="Amount"
                      />
                      <input
                        type="date"
                        className="form-control mb-2"
                        value={transaction.date || ''}
                        onChange={(e) => handleTransactionChange(accountIndex, transactionIndex, 'date', e.target.value)}
                        placeholder="Date"
                      />
                      <button
                        type="button"
                        className="btn btn-success btn-sm mt-2"
                        onClick={() => toggleEditMode(accountIndex, transactionIndex)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span>{transaction.transactionType}</span> - 
                      <span>{formatAmount(transaction.amount)}</span> - 
                      <span>{formatDate(transaction.date)}</span>
                      <button
                        type="button"
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() => toggleEditMode(accountIndex, transactionIndex)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/accounts')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditAccount;
