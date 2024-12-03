
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importe tes composants/pages
import HomePage from "./HomePage";
import Basketball from "./components/Basketball";


import './style/App.css';
import PaymentSuccess from "./components/PayementSuccess";
import OrderSummary from "./components/SummaryOrder";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page d'accueil */}
        <Route path="/" element={<HomePage />} />

        {/* Route pour la page "À propos" */}
        <Route path="/basketball" element={<Basketball />} />

        <Route path="/order-summary" element={<OrderSummary />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />



        {/* Ajoute d'autres routes ici */}
      </Routes>
    </Router>
  );
}

export default App
