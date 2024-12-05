import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../style/SummaryOrder.css";

const OrderSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { products} = location.state;
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState(null);

    // Calculer le total à partir des données passées
    const calculateTotal = () => {
        const formattedPrice = (price) => parseFloat(price.replace(" €", "").replace(",", "."));
        
        const itemsTotal = products.reduce(
            (sum, item) => sum + formattedPrice(item.prix) * item.quantity,
            0
        );
        return itemsTotal.toFixed(2);
    };
    const calculateTaxes = (total) => (parseFloat(total) * 0.2).toFixed(2); // Par exemple, 20% de TVA 

    const handleApprove = (details) => {
        setPaid(true);
        console.log("Transaction réussie :", details);
    };

    const handleError = (err) => {
        setError("Une erreur est survenue pendant le paiement.");
        console.error("Erreur PayPal :", err);
    };

    const total = calculateTotal();
    const taxes = calculateTaxes(total);
    const grandTotal = (parseFloat(total) + parseFloat(taxes)).toFixed(2);

    return (
        <div className="order-summary">
            {/* Section gauche : Panier */}
            <div className="products-section">
                <h2>Panier :</h2>
                <ul className="product-list">
                    {products.map((item) => (
                        <li key={item.id} className="product-item">
                            <img src={item.image ? item.image : "https://via.placeholder.com/150"} alt={item.nom} className="product-image" />
                            <div className="product-info">
                                <span className="product-name">{item.nom}</span>
                                <span className="product-quantity">{item.quantity} x {item.prix} €</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Section droite : Paiement, taxes, livraison */}
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
                        navigate("/payment-success")
                    ) : (
                        <PayPalScriptProvider options={{ "client-id": "AehIMflxXZIJnbnyv6iwknlbh_ApxtG6lCUnVgkggOb_b8xCPNcdOyczWInBgG7KpJEXNRTRJixQRDrm", currency: "EUR" }}>
                            <div className="paypal-buttons-container">
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: grandTotal, // Montant total avec taxes et livraison
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

                    {error && <h3 className="error-message">{error}</h3>}
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
