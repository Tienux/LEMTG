import React from "react";
import "../style/ProductCard.css";

// #region Composant principal
/**
 * Carte de produit affichant les informations principales.
 * Permet de visualiser les détails d'un produit et de l'ajouter au panier.
 *
 * @param {Object} product - Objet contenant les informations du produit.
 * @param {Object} categories - Dictionnaire des catégories, clé : ID, valeur : nom.
 * @param {Function} onProductClick - Fonction appelée lorsqu'on clique sur la carte pour voir les détails.
 * @param {Function} addToBasket - Fonction appelée pour ajouter le produit au panier.
 */
const ProductCard = ({ product, categories, onProductClick, addToBasket }) => {
  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      {/* Titre du produit */}
      <h3 className="product-title">{product.nom}</h3>

      {/* Image du produit */}
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.nom} />
        ) : (
          <img src="https://via.placeholder.com/150" alt="Placeholder" />
        )}
      </div>

      {/* Détails du produit */}
      <div className="product-details">
        <p className="product-price">Prix: ${product.prix}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-category">
          Catégorie: {categories[product.idcategorie] || "Non spécifiée"}
        </p>
      </div>
      {/* Bouton pour ajouter au panier */}
      <button
        className="add-to-basket-button"
        onClick={(event) => {
          event.stopPropagation()
          addToBasket(product)}
        }
      >
        Ajouter au panier
      </button>
    </div>
  );
};
// #endregion

export default ProductCard;
