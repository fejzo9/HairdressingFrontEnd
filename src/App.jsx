import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './Registration/RegistrationForm'
import Home from './Home/Home';
import TermsOfService from './TermsOfService/TermsOfService';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword'; 
import Footer from './Footer/Footer';
import FakeSalonMap from './Maps/FakeSalonMap';
import SalonsPage from './Salons/SalonsPage';
import SalonPage from "./Salons/SalonPage/SalonPage.jsx";
import AboutUs from './AboutUs/AboutUs';
import Header from "./Header/Header.jsx";
import Contact from "./Contact/Contact.jsx";
import AdminPage from './Admin/AdminPage/AdminPage.jsx';
import PrivateRoute from "./PrivateRoute";
import ChangePasswordForm from "./ChangePassword/ChangePasswordForm";
import Profile from "./Profile/Profile";
import AddSalon from "./Salons/AddSalon/AddSalon.jsx"; 
import EditSalon from "./Salons/EditSalon/EditSalon";
import OwnerPage from "./Salons/OwnerPage/OwnerPage.jsx";
import AddHairdresserPage from "./Admin/Add/AddHairdresserPage.jsx";
import AddSalonServices from "./Salons/AddSalonServices/AddSalonServices.jsx";
import SalonServices from "./Salons/SalonServices/SalonServices";
import BookingPage from "./BookingPage/BookingPage";
import HairdresserSchedule from "./HairdresserSchedule/HairdresserSchedule";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const role = localStorage.getItem("role");

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Route path="/maps" element={<FakeSalonMap />} />
            <Route path="/salons" element={<SalonsPage />} />
            <Route path="/salon/:id" element={<SalonPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addSalon" element={<AddSalon />} />
            <Route path="/edit-salon/:id" element={<EditSalon />} /> 
            <Route path="/owner" element={<OwnerPage />} /> 
            <Route path="/add-hairdresser" element={<AddHairdresserPage />} />
            <Route path="/add-service/:salonId" element={<AddSalonServices />} />
            <Route path="/salon/:salonId/services" element={<SalonServices />} />
            <Route path="/rezervacija/:salonId/:hairdresserId" element={<BookingPage />} />
            <Route path="/schedule/:hairdresserId" element={<HairdresserSchedule />} />
             <Route
              path="/admin"
              element={
                <PrivateRoute role={role} allowedRoles={["ADMIN","SUPER_ADMIN"]}>
                  <AdminPage role={role}/>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
       <Footer />
      </div>
    </Router>
    </LocalizationProvider>
    </>
  )
}

export default App
