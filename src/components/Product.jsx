import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Product.css";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import PopupConfirmationAdd from "./PopupConfirmationAdd";
import { useAuth } from "../context/AuthContext";

// #region Composant principal
/**
 * Composant principal pour afficher les produits.
 * Gère la recherche, le filtrage par catégorie, et l'ajout au panier.
 */
const Product = () => {
  // #region États
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState([]); // Liste complète des produits
  const [filteredData, setFilteredData] = useState([]); // Produits filtrés à afficher
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale
  const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné pour la modale
  const [categories, setCategories] = useState([]); // Liste des catégories
  const [showPopup, setShowPopup] = useState(false); // État du popup de confirmation
  const [popupProductName, setPopupProductName] = useState(""); // Nom du produit ajouté au panier
  // #endregion

  // #region Effets
  /**
   * Chargement des catégories et des produits depuis l'API au montage du composant.
   */
  useEffect(() => {
    // Charger les catégories
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        const categoryMap = [];
        response.data.forEach((category) => {
          categoryMap[category.id] = category.name;
        });
        setCategories(categoryMap);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Charger les produits
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  // #endregion

  // #region Gestion des événements
  /**
   * Gère la recherche de produits en fonction du terme saisi.
   */
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  /**
   * Gère le changement de catégorie sélectionnée.
   */
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  /**
   * Filtre les produits en fonction du terme de recherche et de la catégorie.
   */
  const filterProducts = (term, category) => {
    const filtered = data.filter((product) => {
      const matchesCategory =
        category === "" || product.idcategorie.toString() === category;
      const matchesSearchTerm = product.nom.toLowerCase().includes(term);
      return matchesCategory && matchesSearchTerm;
    });
    setFilteredData(filtered);
  };

  /**
   * Ouvre la modale pour un produit donné.
   */
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  /**
   * Ferme la modale.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  /**
   * Ajoute un produit au panier et affiche le popup de confirmation.
   */
  const addToBasket = (product) => {
    // Récupérer le panier actuel
    axios
      .get(`http://localhost:3000/api/users/${user.id}/cart`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        const cart = response.data;
  
        // Vérifier si le produit est déjà dans le panier
        const existingProduct = cart.find((item) => item.productId === product.id);
  
        if (existingProduct) {
          // Si le produit existe, incrémenter sa quantité
          axios
            .post(
              `http://localhost:3000/api/users/${user.id}/cart`,
              { productId: product.id, quantity: existingProduct.quantity + 1 }, // Incrémenter la quantité
              { headers: { Authorization: `Bearer ${user.token}` } }
            )
            .then(() => {
              // Afficher un popup de confirmation à l'utilisateur
              setPopupProductName(product.nom);
              setShowPopup(true);
            })
            .catch((error) => {
              console.error("Erreur lors de la mise à jour de la quantité :", error);
            });
        } else {
          // Si le produit n'existe pas, l'ajouter au panier
          axios
            .post(
              `http://localhost:3000/api/users/${user.id}/cart`,
              { productId: product.id, quantity: 1 }, // Ajouter une unité par défaut
              { headers: { Authorization: `Bearer ${user.token}` } }
            )
            .then(() => {
              // Afficher un popup de confirmation à l'utilisateur
              setPopupProductName(product.nom);
              setShowPopup(true);
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout au panier :", error);
            });
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du panier :", error);
      });
  };
  
  

  
  // #endregion

  // #region Rendu
  return (
    <div>
      {/* Barre de recherche et de filtre */}
      <div className="search-bar">
        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Toutes nos catégories</option>
          {Object.keys(categories).map((key) => (
            <option key={key} value={key}>
              {categories[key]}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher des produits"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button">🔍</button>
      </div>

      {/* Grille des produits */}
      <div className="product-grid">
        {filteredData.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
            onProductClick={openModal}
            addToBasket={addToBasket}
          />
        ))}
      </div>

      {/* Popup de confirmation */}
      <PopupConfirmationAdd
        show={showPopup}
        productName={popupProductName}
        onClose={() => setShowPopup(false)}
      />

      {/* Modale de produit */}
      {isModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>{selectedProduct.nom}</h3>
            <div className="modal-image">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.nom} />
              ) : (
                <img src="https://via.placeholder.com/150" alt="Placeholder" />
              )}
            </div>
            <p>{selectedProduct.description}</p>
            <p>
              <strong>Prix: ${selectedProduct.prix}</strong>
            </p>
            <p>
              <strong>
                Catégorie: {categories[selectedProduct.idcategorie]}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
};

export default Product;
