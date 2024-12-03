import React from "react";
import NavBar from "./components/Navbar";
import Product from "./components/Product";

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
