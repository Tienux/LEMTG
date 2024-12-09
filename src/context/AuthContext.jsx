import React, { createContext, useState, useContext } from "react";

// Créer un contexte pour l'authentification
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); // Permet d'accéder au contexte
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur, null si non connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État de l'authentification

  // Fonction pour connecter l'utilisateur
  const login = (userData) => {
    setUser(userData); // Stocke les informations de l'utilisateur
    setIsAuthenticated(true); // Marque comme authentifié
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUser(null); // Réinitialise l'utilisateur
    setIsAuthenticated(false); // Marque comme non authentifié
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
