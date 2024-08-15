// src/ForgotPassword.jsx
import React, { useState } from 'react';
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      // API endpoint za slanje emaila
     /* const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message || 'If the email is registered, a password reset link will be sent to it.');
      */
      console.log('Sending reset password email to:', email);
      setMessage('If the email is registered, a password reset link will be sent to it.');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      setMessage('There was an error sending the reset email.');
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Your Password?</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <p className="form-footer">
          <a href="/login">Back To Login</a>
        </p>
        <button type="submit">Send Reset Link</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
