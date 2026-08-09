import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 1. Import Firebase tools for fetching a SINGLE document
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

import '../style/ProductPage.css'; 
import Navbar from './Navbar';

export default function ProductPage() {
  const { id } = useParams(); // This grabs the Firebase ID from the URL
  const navigate = useNavigate();
  
  // 2. Set up state for our cloud data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 3. Fetch just THIS ONE product from Firebase when the page loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Point directly to the document with this specific ID in the "products" collection
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          setMainImage(productData.image);
        } else {
          console.error("Product not found in database!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  // ------------------------------------------------------------------
  // CORE FUNCTIONALITY: Saving to LocalStorage (Untouched!)
  // ------------------------------------------------------------------
  const addToCartLogic = () => {
    if (!product) return; // Safety check
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].qty += quantity;
    } else {
      existingCart.push({ ...product, qty: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleAddToCart = () => {
    addToCartLogic();
    setTimeout(() => {
      alert(`${quantity}x ${product.title} added to cart!`);
    }, 50);
  };

  const handleBuyItNow = () => {
    addToCartLogic();
    navigate('/cart');
  };

  // 4. Show a loading state while fetching from the cloud
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center", fontSize: "1.5rem" }}>
          Loading product details...
        </div>
      </>
    );
  }

  // 5. If the URL has a bad ID, show an error instead of crashing
  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center", fontSize: "1.5rem" }}>
          Product not found!
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-wrapper">
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
               {/* Added your oldPrice strikethrough back in just in case! */}
               {product.oldPrice && <del style={{ marginLeft: "10px", color: "gray" }}>Rs. {product.oldPrice}</del>}
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

             {/* Here is your description! It will show up now! */}
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