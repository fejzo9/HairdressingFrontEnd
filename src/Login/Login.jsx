import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ResendVerificationModal from '../Verification/ResendVerificationModal';
import API_BASE_URL from '../config/api';

function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResendModal, setShowResendModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
          },
          body: JSON.stringify(formData),
      });
      
     if (!response.ok) {
        const text = await response.text();
        if (response.status === 403 && text && text.toLowerCase().includes('verif')) {
          setErrorMessage('Please verify your email first.');
        } else {
          setErrorMessage('Login Failed! Invalid login credentials.');
        }
        return;
    }

      const result = await response.json();
      console.log('Login successful:', result);
      alert('Login successful! Welcome back, ' + result.username + '!');
      navigate('/home');

      localStorage.setItem("id", result.id);
      localStorage.setItem("username", result.username);
      localStorage.setItem("role", result.role);
      localStorage.setItem("token", result.token);
      
  } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
  }

    console.log('Logging in with:', formData);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
          {errorMessage.includes('verify your email') && (
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => setShowResendModal(true)}
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Email or Username"
          />
        </div>
        
        <div className="form-group">
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button> 
          </div>
        </div>
        
        <p className="form-footer">
          <a href="/forgot-password">Forgot your password?</a>
        </p>

        <button type="submit">Login</button>
        
        <p className="form-footer">
          Don't have an account? <a href="/registration">Register</a>
        </p>
      </form>

      {showResendModal && (
        <ResendVerificationModal onClose={() => setShowResendModal(false)} />
      )}
    </div>
  );
}

export default LoginForm;
