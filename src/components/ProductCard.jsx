import React from "react";
import "../style/ProductCard.css";

const ProductCard = ({ product, categories, onProductClick, addToBasket }) => {
  return (
    <div className="product-card">
      <h3 className="product-title">{product.nom}</h3>
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.nom} />
        ) : (
          <img src="https://via.placeholder.com/150" alt="Placeholder" />
        )}
      </div>
      <div className="product-details">
        <p className="product-price">Prix: ${product.prix}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-category">
          Catégorie: {categories[product.idcategorie] || "Non spécifiée"}
        </p>
      </div>
      {/* Nouveau bouton "Ajouter au panier" */}
      <button
        className="add-to-basket-button"
        onClick={() => addToBasket(product)}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
