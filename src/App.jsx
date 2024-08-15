
import './App.css'
import RegistrationForm from './Registration/RegistrationForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import TermsOfService from './TermsOfService/TermsOfService';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword'; 
import Footer from './Footer/Footer';

function App() {

  return (
    <>
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
       <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
