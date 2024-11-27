import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const AllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('https://localhost:7000/api/Accounts/AllAccounts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to fetch accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAccounts();
    } else {
      setError('No token found. Please log in.');
      setLoading(false);
    }
  }, [token]);

  const handleViewAccountDetails = (userId) => {
    navigate(`/account/details/${userId}`);
  };
  
  const handleEditUser = (userId) => {
    navigate(`/account/edit/${userId}`);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`https://localhost:7000/api/User/delete/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAccounts(accounts.filter(account => account.userId !== userToDelete));
      setUserToDelete(null);
    } catch (err) {
      setError('Failed to delete the user. Please try again later.');
    }
  };

  const openDeleteConfirmation = (userId) => {
    setUserToDelete(userId);
  };

  const closeDeleteConfirmation = () => {
    setUserToDelete(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('All Accounts Data', 14, 16);
    
    accounts.forEach((account, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${account.username} (${account.userId}) - ${account.accountType} - $${account.balance.toFixed(2)}`, 14, 20 + index * 10);
    });

    doc.save('all_accounts.pdf');
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(accounts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounts Data');
    XLSX.writeFile(workbook, 'all_accounts.xlsx');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2">Loading accounts...</p>
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
      <h2 className="text-center mb-4">All Accounts</h2>
      <div className="d-flex mb-3">
        <button
          className="btn btn-info btn-sm me-2 d-flex align-items-center justify-content-center"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
        <button
          className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
          onClick={handleDownloadExcel}
        >
          Download Excel
        </button>
      </div>


      <table className="table table-striped">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Account Type</th>
            <th>Balance</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td>{account.userId}</td>
              <td>{account.username}</td>
              <td>
                <span className={`badge ${account.role === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                  {account.role}
                </span>
              </td>
              <td>{account.accountType}</td>
              <td>${account.balance.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleViewAccountDetails(account.userId)}
                >
                  Account History
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditUser(account.userId)}
                >
                  Edit User
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => openDeleteConfirmation(account.userId)}
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userToDelete && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this user? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteConfirmation}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAccounts;
