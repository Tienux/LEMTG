import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../style/SummaryOrder.css";

// #region Composant principal
/**
 * Composant représentant le résumé de commande et le paiement.
 * Affiche les produits dans le panier, calcule les totaux, et permet le paiement via PayPal.
 */
const OrderSummary = () => {
  const location = useLocation(); // Récupère les données passées via la navigation
  const navigate = useNavigate(); // Pour rediriger après paiement
  const { products } = location.state; // Liste des produits sélectionnés
  const [paid, setPaid] = useState(false); // État pour indiquer si le paiement est effectué
  const [error, setError] = useState(null); // État pour afficher une erreur de paiement

  // #region Calculs
  /**
   * Calcule le total des produits.
   * @returns {string} Total formaté (deux décimales).
   */
  const calculateTotal = () => {
    const formattedPrice = (price) =>
      parseFloat(price.replace(" €", "").replace(",", "."));

    const itemsTotal = products.reduce(
      (sum, item) => sum + formattedPrice(item.prix) * item.quantity,
      0
    );
    return itemsTotal.toFixed(2);
  };

  /**
   * Calcule la TVA sur le total.
   * @param {string} total - Total des produits (en euros).
   * @returns {string} Montant de la TVA (deux décimales).
   */
  const calculateTaxes = (total) => (parseFloat(total) * 0.2).toFixed(2);

  const total = calculateTotal();
  const taxes = calculateTaxes(total);
  const grandTotal = (parseFloat(total) + parseFloat(taxes)).toFixed(2);
  // #endregion

  // #region Gestion du paiement
  /**
   * Gestion de l'approbation d'un paiement PayPal.
   * @param {Object} details - Détails de la transaction.
   */
  const handleApprove = (details) => {
    setPaid(true); // Marque le paiement comme effectué
    console.log("Transaction réussie :", details);
  };

  /**
   * Gestion des erreurs de paiement.
   * @param {Error} err - Erreur renvoyée par PayPal.
   */
  const handleError = (err) => {
    setError("Une erreur est survenue pendant le paiement.");
    console.error("Erreur PayPal :", err);
  };
  // #endregion

  return (
    <div className="order-summary">
      {/* #region Section gauche : Panier */}
      <div className="products-section">
        <h2>Panier :</h2>
        <ul className="product-list">
          {products.map((item) => (
            <li key={item.id} className="product-item">
              <img
                src={
                  item.image ? item.image : "https://via.placeholder.com/150"
                }
                alt={item.nom}
                className="product-image"
              />
              <div className="product-info">
                <span className="product-name">{item.nom}</span>
                <span className="product-quantity">
                  {item.quantity} x {item.prix} €
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* #endregion */}

      {/* #region Section droite : Paiement, taxes, livraison */}
      <div className="payment-section">
        <h2>Résumé de la commande :</h2>
        <div className="summary-details">
          <div className="summary-item">
            <span>Total des produits :</span>
            <span>{total} €</span>
          </div>
          <div className="summary-item">
            <span>TVA (20%) :</span>
            <span>{taxes} €</span>
          </div>
          <div className="summary-item total">
            <span>Total :</span>
            <span>{grandTotal} €</span>
          </div>

          {/* Paiement via PayPal */}
          {paid ? (
            navigate("/payment-success") // Redirige vers la page de succès après paiement
          ) : (
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AehIMflxXZIJnbnyv6iwknlbh_ApxtG6lCUnVgkggOb_b8xCPNcdOyczWInBgG7KpJEXNRTRJixQRDrm",
                currency: "EUR",
              }}
            >
              <div className="paypal-buttons-container">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: grandTotal, // Montant total avec taxes
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(handleApprove);
                  }}
                  onError={handleError}
                />
              </div>
            </PayPalScriptProvider>
          )}

          {/* Affichage des erreurs */}
          {error && <h3 className="error-message">{error}</h3>}
        </div>
      </div>
      {/* #endregion */}
    </div>
  );
};

export default OrderSummary;
