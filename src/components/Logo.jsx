import React from "react";
import { useNavigate } from "react-router-dom"; // Import pour gérer la navigation

// #region Composant principal
/**
 * Composant représentant le logo de l'application.
 * Le logo est cliquable et redirige l'utilisateur vers la page d'accueil.
 *
 * @param {number} size - Taille du logo (hauteur et largeur en pixels).
 */
const Logo = ({ size }) => {
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur

  // #region Gestion du clic sur le logo
  /**
   * Gère le clic sur le logo pour rediriger l'utilisateur vers la page d'accueil.
   */
  const handleLogoClick = () => {
    navigate("/"); // Redirige vers la racine
  };
  // #endregion

  return (
    <div
      onClick={handleLogoClick} // Action déclenchée au clic
      style={{ cursor: "pointer" }} // Style pour indiquer que le logo est cliquable
    >
      {/* Affiche l'image du logo avec une taille définie */}
      <img src="/logo.png" alt="Logo" height={size} width={size} />
    </div>
  );
};
// #endregion

export default Logo;
