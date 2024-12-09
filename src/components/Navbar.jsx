import React from 'react';
import '../style/NavBar.css';
import Logo from './Logo';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import du contexte

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); // Récupère l'état d'authentification

  return (
    <nav className="navbar">
      <Logo size={"100"} />
      
      <div className="navbar-buttons">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">
              Bonjour, {user ? user.name : "Utilisateur"} {/* Affiche le nom de l'utilisateur */}
            </span>
            <button 
              className="navbar-button logout" 
              onClick={logout} // Déconnecte l'utilisateur
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button 
              className="navbar-button inscription"
              onClick={() => navigate("/inscription")}
            >
              Inscription
            </button>
            <button 
              className="navbar-button connexion"
              onClick={() => navigate("/connexion")}
            >
              Connexion
            </button>
          </>
        )}
        <button 
          className="navbar-button panier" 
          onClick={() => navigate("/basketball")}
        >
          Panier
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
