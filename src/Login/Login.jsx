import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Sprečava podrazumijevanu akciju HTML forme (reload stranice)
    
    try {
      // Šaljemo POST zahtjev na backend s JSON podacima
      const response = await fetch('http://localhost:8080/login', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
          },
          body: JSON.stringify(formData),
      });
      
     if (!response.ok) {
        throw new Error('Login Failed! Invalid login credentials.');
    }

      // Ovdje se čita odgovor koji backend šalje. 
      // Ako backend ne vraća JSON ili vraća neispravan Content-Type, ovaj korak može izazvati grešku.
      const result = await response.json();
      console.log('Login successful:', result);
      // Dodaj alert za uspešnu prijavu
      alert('Login successful! Welcome back, ' + result.firstName + '!');
      navigate('/home'); // Preusmeravanje na glavnu stranicu nakon prijave

      localStorage.setItem("id", result.id);
      localStorage.setItem("username", result.username);
      localStorage.setItem("role", result.role);
      localStorage.setItem("token", result.token);
      
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
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
