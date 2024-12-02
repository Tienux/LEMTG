import React from "react";
import "../style/ConfirmationSupr.css";

function ConfirmationModal({ show, onClose, onConfirm, productName }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmation</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer {productName} de votre panier ?
        </p>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Annuler
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
