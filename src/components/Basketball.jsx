import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationSupr from "./ConfirmationSupr";
import "../style/Basketball.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification

// #region Composant principal
/**
 * Composant principal pour gérer un panier de produits.
 * Permet d'afficher, modifier et supprimer des articles dans un panier.
 */
function Basketball() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Vérification de l'authentification
  const [products, setProducts] = useState([]); // Liste des produits dans le panier
  const [categories, setCategories] = useState([]); // Liste des catégories
  const [selectedProducts, setSelectedProducts] = useState([]); // Produits sélectionnés
  const [showModal, setShowModal] = useState(false); // État d'affichage de la modale de confirmation
  const [productToDelete, setProductToDelete] = useState(null); // Produit à supprimer

  // #region Chargement des données
  /**
   * Charge les données nécessaires au panier (produits, catégories).
   * Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié.
   */
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/connexion");
    } else {
      // Récupérer le panier de l'utilisateur
      axios
        .get(`http://localhost:3000/api/users/${user.id}/cart`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          const cartProducts = response.data;
          setProducts(cartProducts);
  
          // Récupérer les informations détaillées pour chaque produit
          const productIds = cartProducts.map(product => product.productId);
          const productRequests = productIds.map(id =>
            axios.get(`http://localhost:3000/api/products/${id}`)
          );
  
          // Attendre toutes les requêtes
          Promise.all(productRequests)
            .then((productResponses) => {
              const productsWithDetails = cartProducts.map((cartProduct, index) => {
                const productDetails = productResponses[index].data;
                return {
                  ...cartProduct,
                  nom: productDetails.nom,
                  description: productDetails.description,
                  prix: productDetails.prix,
                  image: productDetails.image, // Assurez-vous que votre API retourne l'image ou autre propriété visuelle
                  category: productDetails.category,
                };
              });
              setProducts(productsWithDetails); // Mettre à jour l'état des produits
            })
            .catch((error) => console.error("Error fetching product details:", error));
        })
        .catch((error) => console.error("Error fetching cart:", error));
  
      // Récupération des catégories
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
    }
  }, [isAuthenticated, navigate, user]);
  
  // #endregion

  // #region Fonctions pour gérer les produits
  /**
   * Incrémente la quantité d'un produit dans le panier.
   */
  const incrementQuantity = (productId) => {
    const updatedProducts = [...products];
    const product = updatedProducts.find((p) => p.productId === productId);
    if (product) {
      product.quantity += 1;

      // Mettre à jour le panier via l'API
      axios
        .post(
          `http://localhost:3000/api/users/${user.id}/cart`,
          { productId: productId, quantity: product.quantity },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then((response) => {
          setProducts(updatedProducts);
        })
        .catch((error) => console.error("Error updating cart:", error));
    }
  };

  /**
   * Décrémente la quantité d'un produit dans le panier.
   */
  const decrementQuantity = (productId) => {
    const updatedProducts = [...products];
    const product = updatedProducts.find((p) => p.productId === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;

      // Mettre à jour le panier via l'API
      axios
        .post(
          `http://localhost:3000/api/users/${user.id}/cart`,
          { productId: productId, quantity: product.quantity },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then((response) => {
          setProducts(updatedProducts); // Met à jour les produits après la modification
        })
        .catch((error) => console.error("Error updating cart:", error));
    }
  };

  /**
   * Supprime un produit du panier.
   */
  const deleteProduct = (productId) => {
    axios
      .delete(`http://localhost:3000/api/users/${user.id}/cart`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setProducts(products.filter((product) => product.id !== productId)); // Filtrer le produit supprimé
      })
      .catch((error) => console.error("Error deleting product:", error));
  };
  // #endregion

  // #region Gestion de la sélection de produits
  /**
   * Bascule la sélection d'un produit.
   */
  const toggleProductSelection = (productId) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Dé-sélectionner
          : [...prevSelected, productId] // Ajouter à la sélection
    );
  };

  /**
   * Sélectionne tous les produits du panier.
   */
  const selectAllProducts = () => {
    setSelectedProducts(products.map((product) => product.productId));
  };

  /**
   * Désélectionne tous les produits du panier.
   */
  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  /**
   * Supprime les produits sélectionnés.
   */
  const deleteSelectedProducts = () => {
    const updatedProducts = products.filter(
      (product) => !selectedProducts.includes(product.id)
    );
    setProducts(updatedProducts);
    localStorage.setItem("basket", JSON.stringify(updatedProducts));
    setSelectedProducts([]);
  };
  // #endregion

  // #region Gestion de la modale de confirmation
  /**
   * Confirme la suppression d'un produit.
   */
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
    setShowModal(false);
    setProductToDelete(null);
  };

  /**
   * Annule la suppression d'un produit.
   */
  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };
  // #endregion

  // #region Navigation et calculs
  /**
   * Navigue vers la page de résumé de commande.
   */
  const handleNavigate = () => {
    navigate("/order-summary", { state: { products } });
  };

  /**
   * Calcule le sous-total du panier.
   */
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
  // #endregion

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
              <div key={product.productId} className="basket-item">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    className="select-checkbox"
                    checked={selectedProducts.includes(product.productId)}
                    onChange={() => toggleProductSelection(product.productId)}
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
                    Catégorie: {categories[product.category] || "Non spécifiée"}
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
                      onClick={() => decrementQuantity(product.productId)}
                    >
                      -
                    </button>
                    <span className="quantity">{product.quantity}</span>
                    <button
                      className="increment"
                      onClick={() => incrementQuantity(product.productId)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-basket-message">
              <img src="/panier_vide.svg" alt="Empty basket" height={"500"} />
            </p>
          )}
        </div>
        <p className="basket-total">
          Sous-total ({products.length} article
          {products.length > 1 ? "s" : ""}) : {subtotal} €
        </p>
        <button
          className={`checkout-button ${products.length > 0 ? "" : "disabled"}`}
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
// #endregion
