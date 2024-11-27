import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7000/api/Auth/login', credentials);
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error.response.data);
    }
  };

  const signupNavigation = async () => {
    navigate(`/signup`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f4f7fa' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
        <div className="d-grid gap-2">
          <button className="btn btn-outline-secondary" onClick={signupNavigation}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
