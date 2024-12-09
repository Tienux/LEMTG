import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// #region Composant principal
/**
 * Composant affiché après un paiement réussi.
 * Supprime le panier et redirige automatiquement l'utilisateur vers la page d'accueil après un délai.
 */
const PaymentSuccess = () => {
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur

  // #region Effets
  /**
   * Supprime le panier de localStorage et configure une redirection automatique vers la page d'accueil.
   * Un timer de 5 secondes est utilisé pour la redirection.
   */
  useEffect(() => {
    // Suppression du panier après le succès du paiement
    localStorage.removeItem("basket");

    // Configuration du timer pour redirection
    const timer = setTimeout(() => {
      navigate("/"); // Redirige vers la page d'accueil
    }, 5000);

    // Nettoyage du timer si le composant est démonté avant la fin du délai
    return () => clearTimeout(timer);
  }, [navigate]);
  // #endregion

  // #region Rendu
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Message principal de confirmation */}
      <h1 style={{ color: "green" }}>Paiement reçu avec succès !</h1>

      {/* Message informatif */}
      <p>
        Merci pour votre commande. Vous serez redirigé vers la page d'accueil
        dans quelques instants.
      </p>

      {/* Lien cliquable pour redirection immédiate */}
      <p>
        Si vous n'êtes pas redirigé,{" "}
        <span
          onClick={() => navigate("/")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          cliquez ici
        </span>
        .
      </p>
    </div>
  );
  // #endregion
};

export default PaymentSuccess;
