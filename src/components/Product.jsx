import React from "react";
import axios from "axios";
import "../style/Product.css";
import ProductCard from "./ProductCard"; // Import du nouveau composant

const Product = () => {
    const [data, setData] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
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
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

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
            <div className="product-grid">
                {data.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        categories={categories}
                        onProductClick={openModal}
                    />
                ))}
            </div>

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
                            <strong>Catégorie: {categories[selectedProduct.idcategorie]}</strong>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
