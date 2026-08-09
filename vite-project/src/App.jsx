import './App.css'
import { LandingPage } from './Component/Header'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BestSeller } from './Component/BestSeller';
import ProductPage from './Component/ProductPage';
import CartPage from './Component/CartPage';
import SearchPage from './Component/Searchpage'

import Admin from "./Component/Admin";

function App() {
  return (
    <div>
      <Admin />
    </div>
  );
}

export default App; 

/* function App() {

  return(
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<LandingPage />} />
        
        
        <Route path="/collections/our-best-sellers" element={<BestSeller />} />

        <Route path="/products/:id" element={<ProductPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App */  
 