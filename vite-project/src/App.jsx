import React, { useState, useEffect } from 'react';
import { LandingPage } from './Component/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BestSeller } from './Component/BestSeller';
import ProductPage from './Component/ProductPage';
import CartPage from './Component/CartPage';
import SearchPage from './Component/Searchpage';
import Admin from "./Component/Admin";

import BackButton from './Component/BackButton';

// 1. Import Firebase tools (Make sure this path points to your firebase.js file!)
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 

function App() {
  // 2. Create the Global State here
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Fetch from Firebase exactly ONCE when the app loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <BrowserRouter>


      <BackButton />


      <Routes>
        {/* 4. Pass the data DOWN to any page that needs it! */}
        <Route path="/" element={<LandingPage products={products} loading={loading} />} />
        
        <Route path="/collections/our-best-sellers" element={<BestSeller products={products} loading={loading} />} />
        
        <Route path="/products/:id" element={<ProductPage products={products} loading={loading} />} />
        
        <Route path="/cart" element={<CartPage />} />
        
        <Route path="/search" element={<SearchPage products={products} loading={loading} />} />
        
        {/* Your Admin Dashboard Route (No props needed here) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;