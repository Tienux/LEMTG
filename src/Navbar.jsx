import React from 'react';
import './style/NavBar.css'
import Logo from './Logo';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Logo  size={"100"}/>
  
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
  