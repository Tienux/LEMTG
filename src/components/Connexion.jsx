import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import du contexte
import "../style/Connexion.css";
import { useNavigate } from "react-router-dom"; // Pour la redirection

function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Utilisation du login du contexte
  const navigate = useNavigate(); // Utilisation de la redirection

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
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

      // Mettre à jour le contexte utilisateur avec les données de l'utilisateur
      login(data.user); // Assure-toi que `data.user` contient bien l'objet utilisateur avec `id`, `name`, etc.

      // Redirection vers la page principale après la connexion
      navigate("/"); // ou vers n'importe quelle page après la connexion
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      <form className="connexion-form" onSubmit={handleLogin}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Connexion;
