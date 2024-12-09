import React from "react";
import "../style/PopupConfirmationAdd.css"; // Chemin du fichier CSS

// #region Composant principal
/**
 * Composant pour afficher une popup de confirmation.
 * Utilisé pour informer l'utilisateur qu'un produit a été ajouté au panier.
 *
 * @param {boolean} show - Détermine si la popup doit être affichée.
 * @param {string} productName - Nom du produit ajouté au panier.
 * @param {function} onClose - Fonction appelée pour fermer la popup.
 */
const PopupConfirmationAdd = ({ show, productName, onClose }) => {
  // Si la popup ne doit pas être affichée, retourne `null`
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Titre de la popup */}
        <h2>Produit ajouté au panier !</h2>

        {/* Message personnalisé avec le nom du produit */}
        <p>
          Le produit <strong>{productName}</strong> a été ajouté avec succès à
          votre panier.
        </p>

        {/* Bouton pour fermer la popup */}
        <button className="popup-close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};
// #endregion

export default PopupConfirmationAdd;
