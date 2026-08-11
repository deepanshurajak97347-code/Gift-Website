import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../style/ProductPage.css'; 
import Navbar from './Navbar';

export default function ProductPage({ products, loading }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const location = useLocation();
  const instantProduct = location.state?.productData;
  
  const [product, setProduct] = useState(instantProduct || null);
  const [mainImage, setMainImage] = useState(instantProduct?.image || "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!instantProduct && products.length > 0) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.image);
      }
    }
  }, [id, products, instantProduct]);

  const addToCartLogic = () => {
    if (!product) return; 
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

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center", fontSize: "1.5rem" }}>
          Loading product details...
        </div>
      </>
    );
  }

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
           
           {/* === NEW GALLERY SECTION === */}
           <div className="product-gallery">
             
             {/* THE BLUR IMAGE TRICK IS NOW HERE */}
             <div className="main-image-wrapper">
               <img src={mainImage} className="bg-blur" alt="" aria-hidden="true" />
               <img src={mainImage} alt={product.title} className="main-image fg-clear" loading="lazy" />
             </div>
             
             {/* Map through the images array to create clickable thumbnails */}
             {product.images && product.images.length > 0 && (
               <div className="thumbnail-row" style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto' }}>
                 {product.images.map((imgUrl, index) => (
                   <img 
                     key={index} 
                     src={imgUrl} 
                     alt={`Thumbnail ${index + 1}`} 
                     onClick={() => setMainImage(imgUrl)}
                     style={{ 
                       width: '80px', 
                       height: '80px', 
                       objectFit: 'cover', 
                       cursor: 'pointer',
                       border: mainImage === imgUrl ? '2px solid #333' : '1px solid #ddd',
                       borderRadius: '6px',
                       transition: 'border 0.2s ease'
                     }} 
                   />
                 ))}
               </div>
             )}
           </div>

           {/* Details */}
           <div className="product-details">
             <h1 className="product-title">{product.title}</h1>
             <div className="pricing">
               <span className="current-price">Rs. {product.newPrice}</span>
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

             <div className="action-buttons">
               <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to cart</button>
               <button className="buy-it-now-btn" onClick={handleBuyItNow}>Buy it now</button>
             </div>

             {/* === NEW WHAT'S INSIDE SECTION === */}
             {product.whatsInside && product.whatsInside.length > 0 && (
               <div className="whats-inside" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                 <h3 style={{ marginBottom: "10px", fontSize: "1.1rem" }}>What's Inside:</h3>
                 <ul style={{ paddingLeft: "20px", margin: 0, lineHeight: "1.6" }}>
                   {product.whatsInside.map((item, index) => (
                     <li key={index}>{item}</li>
                   ))}
                 </ul>
               </div>
             )}

             <div className="product-description" style={{ marginTop: "20px" }}>
               <h3 style={{ marginBottom: "10px", fontSize: "1.1rem" }}>Description:</h3>
               <p style={{ lineHeight: "1.6" }}>{product.description}</p>
             </div>
             
           </div>
         </div>
       </div>
      </div>
    </>
  );
}