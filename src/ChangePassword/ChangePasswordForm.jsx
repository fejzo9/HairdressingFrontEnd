import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ChangePasswordForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Držimo zasebne state varijable za prikaz lozinke
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preuzmi username iz lokalne memorije
  const username = localStorage.getItem("username");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setMessage("❌ Lozinka mora imati najmanje 8 karaktera!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Nove lozinke se ne poklapaju!");
      return;
    }

    const response = await fetch("http://localhost:8080/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username, oldPassword, newPassword }),
    });

    const data = await response.text();

    if (response.ok) {
      alert("✅ Lozinka je uspješno promijenjena! Prijavite se ponovo.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      localStorage.removeItem("token");
      localStorage.removeItem("username");

      navigate("/login");
    } else {
      setMessage(`❌ Niste uspjeli promijeniti lozinku: ${data}`);
    }
  };

  return (
    <div className="change-pw-form">
      <h2>Promjena lozinke</h2>
    
      <form onSubmit={handleSubmit}>
        {/* Stara lozinka */}
        <label>Stara lozinka:</label>
        <div className="password-container">
          <input 
            type={showOldPassword ? "text" : "password"} 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Nova lozinka */}
        <label>Nova lozinka:</label>
        <div className="password-container">
          <input 
            type={showNewPassword ? "text" : "password"} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Potvrda nove lozinke */}
        <label>Potvrdi novu lozinku:</label>
        <div className="password-container">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit">Promijeni lozinku</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePasswordForm;
