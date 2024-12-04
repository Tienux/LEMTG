import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Product.css";
import ProductCard from "./ProductCard";
import PopupConfirmationAdd from "./PopupConfirmationAdd";

const Product = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProductName, setPopupProductName] = useState("");

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
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

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

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    const filtered = data.filter((product) => {
      const matchesCategory =
        category === "" || product.idcategorie.toString() === category;
      const matchesSearchTerm = product.nom.toLowerCase().includes(term);
      return matchesCategory && matchesSearchTerm;
    });
    setFilteredData(filtered);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const addToBasket = (product) => {
    // Récupérer les produits existants dans localStorage
    const basket = JSON.parse(localStorage.getItem("basket")) || [];

    // Vérifier si le produit existe déjà dans le panier
    const existingProductIndex = basket.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      // Si le produit existe, augmenter la quantité
      basket[existingProductIndex].quantity =
        (basket[existingProductIndex].quantity || 1) + 1;
    } else {
      // Sinon, ajouter le produit avec une quantité de 1
      basket.push({ ...product, quantity: 1 });
    }

    // Mettre à jour le panier dans localStorage
    localStorage.setItem("basket", JSON.stringify(basket));

    // Afficher le popup
    setPopupProductName(product.nom);
    setShowPopup(true);
  };

  return (
    <div>
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

      <PopupConfirmationAdd
        show={showPopup}
        productName={popupProductName}
        onClose={() => setShowPopup(false)}
      />

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
};

export default Product;
