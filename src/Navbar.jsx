import React from 'react';
import './style/NavBar.css'

const NavBar = () => {
  return (
    <nav className="navbar">
      <h1>Logo</h1>
  
      <div className="navbar-buttons">
        <button className="navbar-button connexion">
          Connexion
        </button>
        <button className="navbar-button panier">
          Panier
        </button>
      </div>
    </nav>
  );
}
  
  export default NavBar;
  