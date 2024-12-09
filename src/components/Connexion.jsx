import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification
import "../style/Connexion.css";
import { useNavigate } from "react-router-dom"; // Pour la redirection

// #region Composant principal
/**
 * Composant pour gérer la connexion de l'utilisateur.
 * Permet à l'utilisateur de saisir ses identifiants et de se connecter.
 */
function Connexion() {
  // #region États
  const [username, setUsername] = useState(""); // État pour le nom d'utilisateur
  const [password, setPassword] = useState(""); // État pour le mot de passe
  const { login } = useAuth(); // Fonction de connexion depuis le contexte
  const navigate = useNavigate(); // Pour rediriger après connexion
  // #endregion

  // #region Gestion de la soumission du formulaire
  /**
   * Gestion de la soumission du formulaire de connexion.
   * Envoie les identifiants à l'API pour authentification.
   *
   * @param {Event} event - Événement de soumission du formulaire.
   */
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Requête POST vers l'API de connexion
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Connexion réussie :", data);

      // Mise à jour du contexte utilisateur
      login(data.user); // Vérifie que `data.user` contient les informations nécessaires

      // Redirection après connexion réussie
      navigate("/"); // Par défaut, redirige vers la page principale
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      alert("Identifiants incorrects"); // Affiche une alerte en cas d'erreur
    }
  };
  // #endregion

  return (
    <div className="connexion-container">
      {/* Titre de la page */}
      <h1>Connexion</h1>

      {/* Formulaire de connexion */}
      <form className="connexion-form" onSubmit={handleLogin}>
        {/* Champ pour le nom d'utilisateur */}
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Mise à jour de l'état
          required
        />

        {/* Champ pour le mot de passe */}
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état
          required
        />

        {/* Bouton de soumission */}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
// #endregion

export default Connexion;
