
import './App.css'
import RegistrationForm from './Registration/RegistrationForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import TermsOfService from './TermsOfService/TermsOfService';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword'; 
import Footer from './Footer/Footer';
import SalonMap from './Maps/FakeSalonMap';
import AboutUs from './AboutUs/AboutUs';

function App() {

  return (
    <>
    <Router>
      <div className="app">
        <main className="content">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/maps" element={<SalonMap />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </main>
        <SalonMap />
       <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
