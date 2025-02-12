import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Header(){
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  // Funkcija za ažuriranje statusa logovanja
  const updateAuthStatus = () => {
    setIsLoggedIn(!!localStorage.getItem("token")); // !! je fora iz JS-a, pretvara string u bool tip, vraća sad true ili false vr.
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  };

   // Osluškujemo promjene u localStorage, dodaje event listener, ažurira stanje prijavljenog korisnika u app
   useEffect(() => {
    window.addEventListener("storage", updateAuthStatus);
    return () => { //cleanup funkcija
      // kada se komponenta unmount-a (uklanja sa ekrana), event listener se ukljanja
      window.removeEventListener("storage", updateAuthStatus); // ovo spriječava curenje memorije (memory leaks)
    };
  }, []);

   // Funkcija za odjavu
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    updateAuthStatus();
    navigate("/login");
  };

    return(
        <div className="home-header">
          <div className="logo-container">
            <img src="/logoHDS.png" alt="Logo" className="site-logo" />
            <h1><a href="/Home" className="site-title">Appointment Booking</a></h1>
        </div>

        {/* Navigacija za glavne stranice */}
        <div className="nav-container">
          <nav>
            <ul className="nav-links">
                <li><Link to="/map">Salon Map</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                 {/* ✅ Prikazuj "Admin" samo ako je korisnik ADMIN */}
            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
              <li><Link to="/admin">Admin</Link></li>
            )}
             {role === "OWNER" && (
              <li><Link to="/salon">Salon</Link></li>
            )}
             {role === "HAIRDRESSER" && (
              <li><Link to="/calendar">Calendar</Link></li>
            )}
            </ul>
         </nav>
        </div>

        {/* Dinamičko prikazivanje linkova */}
        <div className="user-links">
          <nav>
            <ul className="nav-links">
            {isLoggedIn ? (
              <li className="dropdown">
                <span className="dropdown-toggle">Zdravo, {username}!</span>
                <div className="dropdown-content">
                  <Link className="changePW" to="/change-password">Promijeni lozinku</Link> 
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/registration">Register</Link></li>
              </>
            )}
            </ul>
          </nav>
        </div>
    </div>
    );
}

export default Header