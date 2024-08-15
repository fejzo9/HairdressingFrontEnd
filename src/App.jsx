
import './App.css'
import RegistrationForm from './Registration/RegistrationForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import TermsOfService from './TermsOfService/TermsOfService';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword'; 

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
