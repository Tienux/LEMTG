import React from 'react';
import axios from 'axios';
import "../style/Product.css";

const Product = () => {
    const [data, setData] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:3000/api/categories')
            .then((response) => {
                const categories = [];
                response.data.forEach(category => {
                    categories[category.id] = category.name;
                });
                setCategories(categories);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        
        axios.get('http://localhost:3000/api/products')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
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
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => openModal(product)}
                    >
                        <h3 className="product-title">{product.nom}</h3>
                        <div className="product-image">
                            {product.image ?
                                <img src={product.image} alt={product.nom} /> :
                                <img src="https://via.placeholder.com/150" alt="Placeholder" />
                            }
                        </div>
                        <div className="product-details">
                            <p className="product-price">Prix: ${product.prix}</p>
                            <p className="product-description">{product.description}</p>
                            <p className="product-category">Catégorie: {categories[product.idcategorie]}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedProduct.nom}</h3>
                        <div className="modal-image">
                            {selectedProduct.image ?
                                <img src={selectedProduct.image} alt={selectedProduct.nom} /> :
                                <img src="https://via.placeholder.com/150" alt="Placeholder" />
                            }
                        </div>
                        <p>{selectedProduct.description}</p>
                        <p><strong>Prix: ${selectedProduct.prix}</strong></p>
                        <p><strong>Catégorie: {categories[selectedProduct.idcategorie]}</strong></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;