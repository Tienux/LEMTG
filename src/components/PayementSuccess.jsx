import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirige vers la page principale après 5 secondes
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté
    }, [navigate]);

    return (
        <div style={{
            textAlign: "center",
            padding: "50px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ color: "green" }}>Paiement reçu avec succès !</h1>
            <p>Merci pour votre commande. Vous serez redirigé vers la page d'accueil dans quelques instants.</p>
            <p>Si vous n'êtes pas redirigé, <span onClick={() => navigate("/")} style={{ color: "blue", cursor: "pointer" }}>cliquez ici</span>.</p>
        </div>
    );
};

export default PaymentSuccess;
