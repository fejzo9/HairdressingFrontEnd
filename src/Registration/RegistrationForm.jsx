import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import './Registration.css'; 

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^\+\d{3}\d{2}\d{6,7}$/; 

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!emailPattern.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!phonePattern.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
    if (!formData.username) newErrors.username = 'Username is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
        try {
            const response = await fetch('http://localhost:8080/registration', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
           
            const result = await response.json();
            console.log('Registration successful:', result);
            alert("Uspješno ste se registrovali, čestitam! Molimo Vas prijavite se.")
            navigate('/home');
          } catch (error) {
            console.error('Registration error:', error);
            alert(error);
          } 
           
            navigate('/login');
    }
  };

  return (
    <div className="registration-form">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          First Name:
        </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
    </div> 

     <div className="form-group">
        <label>
          Last Name:
        </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
    </div>   

    <div className="form-group">
        <label>
          Birth Date:
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="form-control"
        />
          {errors.birthDate && <span className="error">{errors.birthDate}</span>}
    </div>

    <div className="form-group">
        <label>
          Gender:
        </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
    </div>

    <div className="form-group">
        <label>
          Email:
        </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
    </div>

     <div className="form-group">
        <label>
          Phone Number:
        </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
    </div>    

    <div className="form-group">
        <label>
          Username:
        </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
    </div>

    <div className="form-group">
        <label>
          Password:
        </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
    </div>

    <div className="form-group">
        <label>
          Confirm Password:
        </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
    </div>

        <div className="terms">
          <p>
            By signing up, you agree to our
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"> Terms of Service</a>.
          </p>
        </div>

        <button type="submit">Sign Up</button>

        <p className="form-footer">
          Already has an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;