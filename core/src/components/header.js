import React from 'react';

function Header() {
    return (
      <header id="header" className="header fixed-top">
      <div className="container-fluid container-xl position-relative">
  
        <div className="top-row d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            
            <h1 className="sitename">LeadPage</h1>
          </a>
  
          <div className="d-flex align-items-center">
            <div className="social-links">
              <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
              <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
        </div>
  
      </div>
  
      <div className="nav-wrap">
        <div className="container d-flex justify-content-center position-relative">
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#hero" className="active">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#team">Team</a></li>
             
              
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
  
    </header>
    );
}
export default Header;