import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification
import "../style/Connexion.css";
import { useNavigate } from "react-router-dom"; // Pour la redirection

// #region Composant principal
/**
 * Composant pour gérer la connexion et l'inscription de l'utilisateur.
 * Permet à l'utilisateur de saisir ses identifiants pour se connecter ou s'inscrire.
 */
function Connexion() {
  // #region États
  const [username, setUsername] = useState(""); // État pour le nom d'utilisateur
  const [password, setPassword] = useState(""); // État pour le mot de passe
  const [isSignup, setIsSignup] = useState(false); // État pour savoir si on est en mode inscription
  const { login } = useAuth(); // Fonction de connexion depuis le contexte
  const navigate = useNavigate(); // Pour rediriger après la connexion
  // #endregion

  // #region Gestion de la soumission du formulaire
  /**
   * Gestion de la soumission du formulaire de connexion ou d'inscription.
   * Envoie les identifiants à l'API pour authentification ou inscription.
   *
   * @param {Event} event - Événement de soumission du formulaire.
   */
  const handleAuth = async (event) => {
    event.preventDefault();
    const url = isSignup ? "http://localhost:3000/api/register" : "http://localhost:3000/api/login"; // API d'inscription ou de connexio
    try {
      // Requête POST vers l'API d'inscription ou de connexion
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(isSignup ? "Erreur lors de l'inscription" : "Identifiants incorrects");
      }

      const data = await response.json();

      console.log(data)
      //console.log(isSignup ? "Inscription réussie" : "Connexion réussie", data);

      // Mettre à jour le contexte utilisateur avec les données de l'utilisateur et le token
      login(data.user, data.token);
      navigate("/"); // ou vers une autre page après la connexion
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error.message);
      alert(error.message); // Affiche une alerte en cas d'erreur
    }
  };

  // #endregion

  return (
    <div className="connexion-container">
      {/* Titre de la page */}
      <h1>{isSignup ? "Inscription" : "Connexion"}</h1>

      {/* Formulaire de connexion ou d'inscription */}
      <form className="connexion-form" onSubmit={handleAuth}>
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
        <button type="submit">{isSignup ? "S'inscrire" : "Se connecter"}</button>
      </form>

      {/* Lien pour basculer entre la connexion et l'inscription */}
      <a
        href="#"
        className="toggle-link"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
      </a>
    </div>
  );
}
// #endregion

export default Connexion;
