import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../style/Connexion.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "./Navbar";

function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const signupParam = searchParams.get("signup");
    if (signupParam === "true") {
      setIsSignup(true);
    }
  }, [searchParams]);

  const handleAuth = async (event) => {
    event.preventDefault();
    const url = isSignup ? "http://localhost:3000/api/register" : "http://localhost:3000/api/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(isSignup ? "Erreur lors de l'inscription" : "Identifiants incorrects");
      }

      const data = await response.json();
      login(data.user, data.token);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error.message);
      alert(error.message);
    }
  };

  return (
    <><NavBar />
    <div className="connexion-container">
      <h1>{isSignup ? "Inscription" : "Connexion"}</h1>
      <form className="connexion-form" onSubmit={handleAuth}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required />
        <button type="submit">{isSignup ? "S'inscrire" : "Se connecter"}</button>
      </form>
      <a href="#" className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
      </a>
    </div></>
  );
}

export default Connexion;
