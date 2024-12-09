import React from "react";
import "../style/ConfirmationSupr.css";

// #region Composant principal
/**
 * Composant pour afficher une modale de confirmation.
 * Permet de confirmer ou d'annuler une action, comme la suppression d'un produit.
 *
 * @param {boolean} show - Détermine si la modale doit être affichée.
 * @param {function} onClose - Fonction appelée pour fermer la modale.
 * @param {function} onConfirm - Fonction appelée pour confirmer l'action.
 * @param {string} productName - Nom du produit concerné.
 */
function ConfirmationModal({ show, onClose, onConfirm, productName }) {
  // Si la modale n'est pas censée être affichée, ne retourne rien
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Titre de la modale */}
        <h2>Confirmation</h2>

        {/* Message contextuel affichant le produit ciblé */}
        <p>
          Êtes-vous sûr de vouloir supprimer {productName} de votre panier ?
        </p>

        {/* Boutons d'action : Annuler ou Confirmer */}
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
// #endregion

export default ConfirmationModal;
