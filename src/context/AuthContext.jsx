import React, { createContext, useState, useContext, useEffect } from "react";

// Créer un contexte pour l'authentification
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); // Permet d'accéder au contexte
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur, null si non connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État de l'authentification
  const [token, setToken] = useState(null); // Stockage du token JWT

  useEffect(() => {
    // Vérifier si un token est stocké dans localStorage à l'initialisation
    const savedToken = localStorage.getItem("authToken");
    const savedUser = JSON.parse(localStorage.getItem("authUser"));

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    // Sauvegarder dans le stockage local
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Supprimer les données du stockage local
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
