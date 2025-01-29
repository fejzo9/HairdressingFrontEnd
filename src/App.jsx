
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
import Header from "./Header/Header.jsx";
import Contact from "./Contact/Contact.jsx";
import AdminPage from './Admin/AdminPage';
import PrivateRoute from "./PrivateRoute";

function App() {
  const role = localStorage.getItem("role");

  return (
    <>
    <Router>
      <div className="app">
      <Header />
        <main className="content">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/registration" element={<RegistrationForm />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/maps" element={<SalonMap />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

              <Route
              path="/admin"
              element={
                <PrivateRoute role={role} allowedRoles={["ADMIN"]}>
                  <AdminPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
       <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
