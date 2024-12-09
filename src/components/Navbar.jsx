import React from "react";
import "../style/NavBar.css";
import Logo from "./Logo"; // Composant Logo
import { useNavigate } from "react-router-dom"; // Gestion de la navigation
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification

// #region Composant principal
/**
 * Composant représentant la barre de navigation.
 * Affiche le logo, les boutons de connexion, d'inscription, et un bouton panier.
 * Si l'utilisateur est connecté, affiche également son nom et un bouton de déconnexion.
 */
const NavBar = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const { isAuthenticated, user, logout } = useAuth(); // Récupère l'état d'authentification et les actions associées

  return (
    <nav className="navbar">
      {/* Logo redirigeant vers la page d'accueil */}
      <Logo size={"100"} />

      {/* Conteneur des boutons de navigation */}
      <div className="navbar-buttons">
        {/* Affiche différents boutons selon l'état d'authentification */}
        {isAuthenticated ? (
          <>
            {/* Message personnalisé avec le nom de l'utilisateur */}
            <span className="navbar-user">
              Bonjour, {user ? user.name : "Utilisateur"}
            </span>
            {/* Bouton pour déconnecter l'utilisateur */}
            <button className="navbar-button logout" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* Bouton pour naviguer vers la page d'inscription */}
            <button
              className="navbar-button inscription"
              onClick={() => navigate("/inscription")}
            >
              Inscription
            </button>
            {/* Bouton pour naviguer vers la page de connexion */}
            <button
              className="navbar-button connexion"
              onClick={() => navigate("/connexion")}
            >
              Connexion
            </button>
          </>
        )}
        {/* Bouton pour naviguer vers la page du panier */}
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
// #endregion

export default NavBar;
