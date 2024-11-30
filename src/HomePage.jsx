import React from "react";
import NavBar from "./components/NavBar"; // Modifie le chemin selon ton projet
import Product from "./components/Product"; // Modifie le chemin selon ton projet

function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Product />
      </div>
    </div>
  );
}

export default HomePage;
