import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/login', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: formData.emailOrUsername, // Ili email ako koristiš email za login
            password: formData.password, // Slanje pw-a
          }),
      });

      if (!response.ok) {
          throw new Error('Login Failed! Invalid login credentials.');
      }

      const result = await response.json();
      console.log('Login successful:', result);

      // Dodaj alert za uspešnu prijavu
      alert('Login successful! Welcome back, ' + result.firstName + '!');
      navigate('/home'); // Preusmeravanje na glavnu stranicu nakon prijave
  } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
  }

    console.log('Logging in with:', formData);
    // After successful login, redirect to home page
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
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
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
