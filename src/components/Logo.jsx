import React from "react";
import { useNavigate } from "react-router-dom"; // Import pour gérer la navigation

const Logo = ({ size }) => {
  const navigate = useNavigate(); // Hook pour la redirection

  const handleLogoClick = () => {
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
      <img src="/logo.png" alt="Logo" height={size} width={size} />
    </div>
  );
};

export default Logo;
