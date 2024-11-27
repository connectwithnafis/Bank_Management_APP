import React, { useEffect, useState } from 'react';
import axios from '../../../src/axiosConfig'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('https://localhost:7000/api/Accounts/User/1', { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts', error);
      }
    };

    if (token) {
      fetchAccounts();
    } else {
      console.log('No token found');
    }
  }, [token]);

  return (
    <div className="container mt-4">
      <h3>Your Accounts</h3>
      {accounts.length > 0 ? (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.accountType}</td>
                  <td>{account.balance}</td>
                  <td>
                    <button className="btn btn-info me-2" onClick={() => window.location.href = `/account/details/${account.id}`}>View</button>
                    <button className="btn btn-warning me-2" onClick={() => window.location.href = `/account/edit/${account.id}`}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(account.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );

  async function handleDelete(accountId) {
    try {
      await axios.delete(`https://localhost:7000/api/Accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(accounts.filter(account => account.id !== accountId));
    } catch (error) {
      console.error('Error deleting account', error);
    }
  }
};

export default AccountsList;
