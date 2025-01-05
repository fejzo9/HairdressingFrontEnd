import "./Header.css";
import { Link } from "react-router-dom";

function Header(){
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
            </ul>
         </nav>
        </div>

        <div className="user-links">
          <nav>
            <ul className="nav-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/registration">Register</Link></li> 
            </ul>
          </nav>
        </div>
    </div>
    );
}

export default Header