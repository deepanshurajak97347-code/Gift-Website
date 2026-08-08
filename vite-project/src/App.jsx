import './App.css'
import { LandingPage } from './Component/Header'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BestSeller } from './Component/BestSeller';
import ProductPage from './Component/ProductPage';
import CartPage from './Component/CartPage';
import SearchPage from './Component/Searchpage'

function App() {

  return(
    <BrowserRouter>
      <Routes>
        {/* When the URL is "/", show the main landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* When the URL is "/collections/our-best-sellers", show the new page */}
        <Route path="/collections/our-best-sellers" element={<BestSeller />} />

        <Route path="/products/:id" element={<ProductPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
