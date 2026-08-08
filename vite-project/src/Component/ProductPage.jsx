import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS } from '../constants'; 
import '../style/ProductPage.css'; 
import Navbar from './Navbar';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = ALL_PRODUCTS.find(p => String(p.id) === String(id));
  const [mainImage, setMainImage] = useState(product?.image);
  
  // State for Quantity
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) setMainImage(product.image);
  }, [product]);


// ------------------------------------------------------------------
  // CORE FUNCTIONALITY: Saving to LocalStorage
  // ------------------------------------------------------------------
  
  // 1. The Core Engine (Does the math and shouts to the Navbar)
  const addToCartLogic = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].qty += quantity;
    } else {
      existingCart.push({ ...product, qty: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // THE MEGAPHONE: This forces the Navbar bubble to instantly update!
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 2. Add to Cart Button (Shows alert, stays on page)
  const handleAddToCart = () => {
    addToCartLogic();
    //alert(`${quantity}x ${product.title} added to cart!`);

    // We delay the alert by just 50 milliseconds.
    // This gives the screen enough time to visually update the bubble first!
    setTimeout(() => {
      alert(`${quantity}x ${product.title} added to cart!`);
    }, 50);
  };

  // 3. Buy It Now Button (No alert, instantly teleports to cart)
  const handleBuyItNow = () => {
    addToCartLogic();
    navigate('/cart');
  };

  return (
    <>

     <Navbar />
     <div className="product-wrapper">{/* Added just for css wrap.. */}
      <div className="product-page">
        <div className="product-container">
          
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img src={mainImage} alt={product.title} className="main-image" />
            </div>
          </div>

          {/* Details */}
          <div className="product-details">
            <h1 className="product-title">{product.title}</h1>
            <div className="pricing">
              <span className="current-price">Rs. {product.newPrice}</span>
            </div>
            
            {/* Quantity Controls */}
            <div className="quantity-selector">
              <label>Quantity</label>
              <div className="quantity-box">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="text" value={quantity} readOnly className="qty-input" />
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Buttons mapped to logic */}
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to cart</button>
              <button className="buy-it-now-btn" onClick={handleBuyItNow}>Buy it now</button>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
     </div>
    </>
  );
}