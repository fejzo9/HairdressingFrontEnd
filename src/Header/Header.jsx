import "./Header.css"

function Header(){
    return(
        <div className="home-header">
          <div className="logo-container">
            <img src="src\assets\logoHDS.png" alt="Logo" className="site-logo" />
            <h1><a href="/Home" className="site-title">Hairdressing Salon Booking</a></h1>
         
        <nav>
          <ul className="nav-links">
       
              <li><a href="/map">Salon Map</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        </div>
        
        <nav>
          <ul className="nav-links">
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li> 
          </ul>
        </nav>
    </div>
    );
}

export default Header