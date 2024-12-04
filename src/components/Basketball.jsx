import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationSupr from "./ConfirmationSupr";
import "../style/Basketball.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";

function Basketball() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Produits sélectionnés
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    // Vérifier si le panier existe dans localStorage, sinon l'initialiser vide
    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    if (basket.length === 0) {
      localStorage.setItem("basket", JSON.stringify([])); // Initialiser le panier vide
    }
    setProducts(basket);

    // Charger les catégories depuis l'API
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
  }, []);

  const incrementQuantity = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("basket", JSON.stringify(updatedProducts));
  };

  const decrementQuantity = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("basket", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    localStorage.setItem("basket", JSON.stringify(updatedProducts)); // Mettre à jour localStorage
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Dé-sélectionner
          : [...prevSelected, productId] // Ajouter à la sélection
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(products.map((product) => product.id));
  };

  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  const deleteSelectedProducts = () => {
    const updatedProducts = products.filter(
      (product) => !selectedProducts.includes(product.id)
    );
    setProducts(updatedProducts);
    localStorage.setItem("basket", JSON.stringify(updatedProducts)); // Mettre à jour localStorage
    setSelectedProducts([]);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
    setShowModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleNavigate = () => {
    navigate("/order-summary", { state: { products } });
  };

  const calculateSubtotal = () => {
    return products
      .reduce(
        (total, product) =>
          total + parseFloat(product.prix || 0) * product.quantity,
        0
      )
      .toFixed(2);
  };

  const subtotal = calculateSubtotal();

  return (
    <div>
      <NavBar />
      <div className="basket-container">
        <ConfirmationSupr
          show={showModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={productToDelete?.nom}
        />
        <div className="basket-header">
          <h1 className="basket-title">Votre panier</h1>
          <div className="action-buttons-container">
            {selectedProducts.length > 0 && (
              <button
                className="delete-selected"
                onClick={deleteSelectedProducts}
              >
                Supprimer les éléments sélectionnés
              </button>
            )}
            <button className="select-all-button" onClick={selectAllProducts}>
              Sélectionner tout
            </button>
            <button
              className="deselect-all-button"
              onClick={deselectAllProducts}
            >
              Désélectionner tout
            </button>
          </div>
        </div>
        <hr />
        <div className="basket-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="basket-item">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    className="select-checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                  />
                </div>
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.nom}
                  className="basket-item-image"
                />
                <div className="basket-item-details">
                  <h2 className="basket-item-title">{product.nom}</h2>
                  <p className="basket-item-category">
                    Catégorie:{" "}
                    {categories[product.idcategorie] || "Non spécifiée"}
                  </p>
                  <p className="basket-item-description">
                    {product.description}
                  </p>
                  <p className="basket-item-price">Prix: {product.prix} €</p>
                  <div className="quantity-control">
                    <button
                      className="delete-item"
                      onClick={() => {
                        setProductToDelete(product);
                        setShowModal(true);
                      }}
                    >
                      🗑️
                    </button>
                    <button
                      className="decrement"
                      onClick={() => decrementQuantity(product.id)}
                    >
                      -
                    </button>
                    <span className="quantity">{product.quantity}</span>
                    <button
                      className="increment"
                      onClick={() => incrementQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-basket-message">Votre panier est vide.</p>
          )}
        </div>
        <p className="basket-total">
          Sous-total ({products.length} article
          {products.length > 1 ? "s" : ""}) : {subtotal} €
        </p>
        <button
          className={`checkout-button ${subtotal === "0.00" ? "disabled" : ""}`}
          onClick={handleNavigate}
          disabled={subtotal === "0.00"}
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
}

export default Basketball;
