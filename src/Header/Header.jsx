import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Header(){
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [profilePicture, setProfilePicture] = useState("/user-photo.png");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Funkcija za ažuriranje statusa logovanja
  const updateAuthStatus = () => {
    setIsLoggedIn(!!localStorage.getItem("token")); // !! je fora iz JS-a, pretvara string u bool tip, vraća sad true ili false vr.
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  };

  // Dohvati profilnu sliku korisnika
  useEffect(() => {
      const fetchProfilePicture = async () => {
        if (isLoggedIn) {
          try {
            const response = await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}/profile-picture`);
            if (response.ok) {
              const blob = await response.blob();
              setProfilePicture(URL.createObjectURL(blob));
            }
          } catch (error) {
            console.error("Greška pri dohvaćanju profilne slike:", error);
          }
        }
      };
      fetchProfilePicture();
    }, [isLoggedIn]);

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
    setIsLoggedIn(false);
    navigate("/login");
  };
 
  return(
    <nav className="navbar navbar-expand-lg home-header">
       <div className="container">
          <div className="home-header">
             {/* Logo */}
              <div className="logo-container">
            <a href="/Home"> <img src="/logoHDS.png" alt="Logo" className="site-logo" /></a>
                <h1><a href="/Home" className="site-title">Appointment App</a></h1>
            </div>   

              {/* Hamburger dugme za manje ekrane */}
              <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

          {/* Navigacija - sakriva se na malim ekranima */}
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
                    <div className="nav-container ms-auto">
                        <ul className="navbar-nav nav-links">
                            <li className="nav-item"><Link className="nav-link" to="/maps">Salon Map</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/about-us">About Us</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>

                            {/* Admin opcije */}
                            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/addSalon">Add Salon</Link></li>
                                </>
                            )}
                            {role === "OWNER" && <li className="nav-item"><Link className="nav-link" to="/salon">Salon</Link></li>}
                            {role === "HAIRDRESSER" && <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>}
                        </ul>
                    </div>

            {/* Dinamičko prikazivanje linkova */}
            <div className="user-links">
              <nav>
                <ul className="nav-links">
                {isLoggedIn ? (
                  <li className="dropdown">
                    <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <img className="profile-pic" src={profilePicture} alt="Profilna slika" />
                      <span>{username}</span>
                    </div>
                    {dropdownOpen && (
                      <div className="dropdown-content">
                        <Link className="profil" to="/profile">Profil</Link>
                        <Link className="changePW" to="/change-password">Promijeni lozinku</Link> 
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    )}
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
    </div>
  </div>
</nav>
);
    
}

export default Header