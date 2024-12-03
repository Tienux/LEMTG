import React from 'react';
import '../style/NavBar.css';
import Logo from './Logo';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  return (
    <nav className="navbar">
      <Logo size={"100"} />
      
      <div className="navbar-buttons">
        <button className="navbar-button inscription">
            Inscription
          </button>
        <button className="navbar-button connexion">
          Connexion
        </button>
        <button 
          className="navbar-button panier" 
          onClick={() => navigate("/basketball")} // Redirige vers la page Basketball
        >
          Panier
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
