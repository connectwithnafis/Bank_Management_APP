import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Signup = () => {
    const [user, setUser] = useState({ username: '', password: '', role: 'Customer' });
    const navigate = useNavigate(); 

    const handleSignup = async () => {
      try {
        const response = await axios.post('https://localhost:7000/api/Auth/register', user);
        if (response.status === 200) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Signup failed', error);
      }
    };
  
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Sign Up</h2>
          
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Role:</label>
            <select
              className="form-select"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="Customer">Customer</option>
              <option value="BankEmployee">Bank Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button className="btn btn-primary w-100" onClick={handleSignup}>Sign Up</button>
          
          <div className="mt-3 text-center">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    );
};

export default Signup;
