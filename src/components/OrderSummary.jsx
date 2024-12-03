import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const OrderSummary = () => {
    const location = useLocation();
    const { order } = location.state;
    const [paid, setPaid] = useState(false); // État pour suivre le paiement
    const [error, setError] = useState(null); // État pour les erreurs de paiement

    // Calculer le total à partir des données passées
    const calculateTotal = () => {
        const formattedPrice = (price) => parseFloat(price.replace(" €", "").replace(",", "."));
        
        const itemsTotal = order.products.reduce(
            (sum, item) => sum + formattedPrice(item.prix) * item.quantity,
            0
        );
        return itemsTotal.toFixed(2);
    };

    const handleApprove = (details) => {
        setPaid(true);
        console.log("Transaction réussie :", details);
    };

    const handleError = (err) => {
        setError("Une erreur est survenue pendant le paiement.");
        console.error("Erreur PayPal :", err);
    };

    const total = calculateTotal();

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1>Récapitulatif de Commande</h1>
            <h3>Client : {order.clientNom}</h3>
            <div>
                <h2>Produits :</h2>
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                    {order.products.map((item) => (
                        <li key={item.id} style={{ marginBottom: "10px" }}>
                            <span style={{ fontWeight: "bold" }}>{item.nom}</span> - {item.quantity} x {item.prix} €
                        </li>
                    ))}
                </ul>

                <h2>Total : {total} €</h2>

                {paid ? (
                    <h3 style={{ color: "green" }}>Paiement réussi ! Merci pour votre commande.</h3>
                ) : (
                    <PayPalScriptProvider options={{ "client-id": "VOTRE_CLIENT_ID_PAYPAL", currency: "EUR" }}>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: total, // Montant total
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
                    </PayPalScriptProvider>
                )}

                {error && <h3 style={{ color: "red" }}>{error}</h3>}
            </div>
        </div>
    );
};

export default OrderSummary;
