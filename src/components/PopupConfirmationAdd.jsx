import React from "react";
import "../style/PopupConfirmationAdd.css"; // Chemin du fichier CSS

const PopupConfirmationAdd = ({ show, productName, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Produit ajouté au panier !</h2>
        <p>
          Le produit <strong>{productName}</strong> a été ajouté avec succès à
          votre panier.
        </p>
        <button className="popup-close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default PopupConfirmationAdd;
