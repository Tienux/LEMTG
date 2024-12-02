import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Product.css";
import ProductCard from "./ProductCard"; // Import du nouveau composant

const Product = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Récupération des produits
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data); // Initialisation des produits filtrés
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(
      data.filter((product) => product.nom.toLowerCase().includes(term))
    );
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Barre de recherche */}
      <div className="search-bar">
        <select className="category-select">
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
          />
        ))}
      </div>

      {/* Modal */}
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
