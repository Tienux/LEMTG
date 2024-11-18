import React from 'react';
import data from './data.json'

const Product = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent:'center'}}>
        {data.map((product) => (
          <div 
            key={product.id} 
          >
            <h3>{product.nom}</h3>
            <p>Prix: ${product.prix}</p>
            <p>{product.description}</p>
            <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0' }}>
              {product.image ? <img src={product.image} alt={product.nom} style={{ width: '100%', height: '100%'}} /> : 'Aucune image'}
            </div>
          </div>
        ))}
      </div>
    );
  }

export default Product