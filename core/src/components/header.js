import React from 'react';
import "../Header.css";

function Header() {
    return (
      <header id="header" className="header fixed-top">
      <div className="container-fluid container-xl position-relative">
  
        <div className="top-row d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            
            <h1 className="sitename">Algoritm</h1>
          </a>
  <div className="d-flex align-items-center">
  <div className="social-links">
    <a
      href="https://github.com/MaryamKalantarii/"
      className="github"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="bi bi-github"></i>
    </a>

    <a
      href="https://github.com/mhidusti/"
      className="github"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="bi bi-github"></i>
    </a>
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
              <li><a href="#algoritm">Algoritm</a></li>
              <li><a href="#chart">Chart</a></li>
             
              
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
  
    </header>
    );
}
export default Header;