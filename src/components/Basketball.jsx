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
  const [productsToDelete, setProductsToDelete] = useState([]); // Produits à supprimer

  // #region Chargement des données
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
          const productIds = cartProducts.map((product) => product.productId);
          const productRequests = productIds.map((id) =>
            axios.get(`http://localhost:3000/api/products/${id}`)
          );

          Promise.all(productRequests)
            .then((productResponses) => {
              const productsWithDetails = cartProducts.map((cartProduct, index) => {
                const productDetails = productResponses[index].data;
                return {
                  ...cartProduct,
                  nom: productDetails.nom,
                  description: productDetails.description,
                  prix: productDetails.prix,
                  image: productDetails.image,
                  category: productDetails.category,
                };
              });
              setProducts(productsWithDetails);
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
  const updateProductQuantity = (productId, newQuantity) => {
    const updatedProducts = [...products];
    const product = updatedProducts.find((p) => p.productId === productId);
    if (product) {
      if (newQuantity === 0) {
        axios
          .delete(`http://localhost:3000/api/users/${user.id}/cart`, {
            data: { productId: productId },
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then(() => {
            setProducts(updatedProducts.filter((p) => p.productId !== productId));
          })
          .catch((error) =>
            console.error("Error deleting product from cart:", error)
          );
        return;
      }
      product.quantity = newQuantity;

      axios
        .post(
          `http://localhost:3000/api/users/${user.id}/cart`,
          { productId: productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then(() => {
          setProducts(updatedProducts);
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
          product.quantity = product.quantity + (newQuantity > product.quantity ? -1 : 1);
          setProducts([...updatedProducts]);
        });
    }
  };

  const deleteSelectedProducts = () => {
    console.log("Selected Products to delete: ", selectedProducts);
  
    // Récupérer les produits correspondant aux IDs dans selectedProducts
    const productsToDelete = products.filter((product) =>
      selectedProducts.includes(product.productId)
    );
    let updatedProducts = [...products];
  
    // Pour chaque produit à supprimer
    productsToDelete.forEach((product) => {
      axios
        .delete(`http://localhost:3000/api/users/${user.id}/cart`, {
          data: { productId: product.productId },
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then(() => {
          updatedProducts = updatedProducts.filter(
            (p) => p.productId !== product.productId
          );
          setProducts(updatedProducts);
        })
        .catch((error) => {
          console.error(
            `Error deleting product with ID ${product.productId} from cart:`,
            error
          );
        });
    });
  
    // Réinitialiser les produits sélectionnés après la suppression
    setSelectedProducts([]);
  };
  

  const handleDeleteClick = (productsToDelete) => {
    setShowModal(true);
    setProductsToDelete(productsToDelete);
  };
  // #endregion

  // #region Gestion de la modale de confirmation
  const confirmDelete = () => {
    productsToDelete.forEach((product) => updateProductQuantity(product.productId, 0));
    setShowModal(false);
    setProductsToDelete([]);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductsToDelete([]);
  };
  // #endregion

  // #region Gestion de la sélection de produits
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(products.map((product) => product.productId));
  };

  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  const handleDeleteSelected = () => {
    const productsToBeDeleted = products.filter((product) =>
      selectedProducts.includes(product.productId)
    );
    handleDeleteClick(productsToBeDeleted);
  };
  // #endregion

  // #region Navigation et calculs
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
  // #endregion

  return (
    <div>
      <NavBar />
      <div className="basket-container">
        <ConfirmationSupr
          show={showModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={productsToDelete.map((p) => p.nom).join(", ")}
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
                      onClick={() => handleDeleteClick([product])}
                    >
                      🗑️
                    </button>
                    <button
                      className="decrement"
                      onClick={() => {
                        const targetProduct = products.find(
                          (p) => p.productId === product.productId
                        );
                        if (targetProduct) {
                          if (targetProduct.quantity === 1) {
                            handleDeleteClick([product]);
                          }
                          else {updateProductQuantity(
                            targetProduct.productId,
                            targetProduct.quantity - 1
                          );}
                        }
                      }}
                    >
                      -
                    </button>
                    <span className="quantity">{product.quantity}</span>
                    <button
                      className="increment"
                      onClick={() => {
                        const targetProduct = products.find(
                          (p) => p.productId === product.productId
                        );
                        if (targetProduct) {
                          updateProductQuantity(
                            targetProduct.productId,
                            targetProduct.quantity + 1
                          );
                        }
                      }}
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
