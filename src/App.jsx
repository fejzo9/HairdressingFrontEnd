
import './App.css'
import RegistrationForm from './Registration/RegistrationForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import TermsOfService from './TermsOfService/TermsOfService';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
