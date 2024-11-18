import React from 'react';


const NavBar = () => {
    return (
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px', 
        borderBottom: '1px solid #ccc' 
      }}>
        <h1 style={{ margin: 0 }}>Logo</h1> {/* Remplace "Logo" par le nom ou logo de ton choix */}
  
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            style={{ 
              padding: '10px 15px', 
              border: 'none', 
              borderRadius: '4px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            Connexion
          </button>
          <button 
            style={{ 
              padding: '10px 15px', 
              border: 'none', 
              borderRadius: '4px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            Panier
          </button>
        </div>
      </nav>
    );
  }
  
  export default NavBar;
  