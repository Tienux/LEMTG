import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationSupr from "./ConfirmationSupr";
import Logo from "./Logo"; // Import du composant Logo
import "../style/Basketball.css";
import { useNavigate } from "react-router-dom";

function Basketball() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]); // Produits sélectionnés
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
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

    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        const initialQuantities = {};
        response.data.forEach((product) => {
          initialQuantities[product.id] = 1;
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
    if (quantities[productId] === 1) {
      // Si la quantité est 1, demande confirmation avant suppression
      setProductToDelete(products.find((product) => product.id === productId));
      setShowModal(true);
    } else {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: Math.max(1, prevQuantities[productId] - 1),
      }));
    }
  };

  const deleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
    setQuantities((prevQuantities) => {
      const { [productId]: _, ...newQuantities } = prevQuantities;
      return newQuantities;
    });
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Dé-sélectionner
          : [...prevSelected, productId] // Ajouter à la sélection
    );
  };

  const deleteSelectedProducts = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => !selectedProducts.includes(product.id))
    );
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
    const formattedProducts = products.map((product) => ({
      ...product,
      quantity: quantities[product.id],
    }));
    navigate("/order-summary", {state: {products: formattedProducts}})
  }

  const calculateSubtotal = () => {
    return products
      .reduce(
        (total, product) =>
          total + parseFloat(product.prix || 0) * quantities[product.id],
        0
      )
      .toFixed(2);
  };

  const subtotal = calculateSubtotal();

  return (
    <div>
      {/* Barre en haut avec le logo */}
      <div className="header-bar">
        <Logo size={100} /> {/* Utilisation du composant Logo */}
        <h1 className="header-title">Panier</h1>
      </div>

      {/* Contenu principal */}
      <div className="basket-container">
        <ConfirmationSupr
          show={showModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={productToDelete?.nom}
        />
        <div className="basket-header">
          <h1 className="basket-title">Votre panier</h1>
          {selectedProducts.length > 0 && (
            <button
              className="delete-selected"
              onClick={deleteSelectedProducts}
            >
              Supprimer les éléments sélectionnés
            </button>
          )}
        </div>
        <hr />
        <div className="basket-grid">
          {products.map((product) => (
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
                <p className="basket-item-description">{product.description}</p>
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