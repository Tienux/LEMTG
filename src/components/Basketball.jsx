import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Basketball.css";

function Basketball() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({}); // Object to track quantities per product

  useEffect(() => {
    // Fetch categories
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        const categoryMap = [];
        response.data.forEach((category) => {
          categoryMap[category.id] = category.name;
        });
        setCategories(categoryMap);
      })
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch products
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        const initialQuantities = {};
        response.data.forEach((product) => {
          initialQuantities[product.id] = 1; // Default quantity is 1
        });
        setProducts(response.data);
        setQuantities(initialQuantities);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const incrementQuantity = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] - 1), // Minimum quantity is 1
    }));
  };

  return (
    <div className="basket-container">
      <div className="basket-header">
        <h1 className="basket-title">Votre panier</h1>
        <a href="#" className="basket-deselect">
          Désélectionner tous les éléments
        </a>
      </div>
      <hr />
      <div className="basket-grid">
        {products.map((product) => (
          <div key={product.id} className="basket-item">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.nom}
              className="basket-item-image"
            />
            <div className="basket-item-details">
              <h2 className="basket-item-title">{product.nom}</h2>
              <p className="basket-item-category">
                Catégorie: {categories[product.idcategorie] || "Non spécifiée"}
              </p>
              <p className="basket-item-description">{product.description}</p>
              <p className="basket-item-price">Prix: {product.prix} €</p>
              {/* Quantity Control */}
              <div className="quantity-control">
                <button
                  className="decrement"
                  onClick={() => decrementQuantity(product.id)}
                >
                  🗑️
                </button>
                <span className="quantity">{quantities[product.id]}</span>
                <button
                  className="increment"
                  onClick={() => incrementQuantity(product.id)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="basket-summary">
        <p className="basket-total">
          Sous-total ({products.length} article
          {products.length > 1 ? "s" : ""}) :{" "}
          {products
            .reduce(
              (total, product) =>
                total + parseFloat(product.prix || 0) * quantities[product.id],
              0
            )
            .toFixed(2)}{" "}
          €
        </p>
        <div className="gift-option">
          <input type="checkbox" id="gift" />
          <label htmlFor="gift">Commande contenant un cadeau</label>
        </div>
        <button className="checkout-button">Passer la commande</button>
      </div>
    </div>
  );
}

export default Basketball;
