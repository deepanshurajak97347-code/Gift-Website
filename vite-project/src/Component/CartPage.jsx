import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // ADDED: Imports your new luxury header

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  // 1. Pull data from LocalStorage when page loads
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Remove items
  const removeItem = (idToRemove) => {
    const updatedCart = cartItems.filter(item => item.id !== idToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // ADDED: Shouts to Navbar to update the notification bubble!
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 3. Calculate Total
  const totalPrice = cartItems.reduce((total, item) => {
    const cleanPrice = parseFloat(item.newPrice.replace(/,/g, ''));
    return total + (cleanPrice * item.qty);
  }, 0);

  // 4. Formatter for WhatsApp (Your Checkout Engine)
  const handleCheckout = (e) => {
    e.preventDefault(); 
    
    let message = `*New Order Placed!*%0A%0A`;
    message += `*Name:* ${formData.name}%0A`;
    message += `*Phone:* ${formData.phone}%0A`;
    message += `*Address:* ${formData.address}%0A%0A`;
    message += `*Order Details:*%0A`;
    
    cartItems.forEach(item => {
      message += `- ${item.qty}x ${item.title} (Rs. ${item.newPrice})%0A`;

      message += `  Image: ${item.image}%0A%0A`;    // updated....
    });
    
    message += `%0A*Total to Pay:* Rs. ${totalPrice.toFixed(2)}`;

    // TODO: REPLACE THIS WITH YOUR BUSINESS NUMBER
    const yourWhatsAppNumber = "9244740820"; 
    window.open(`https://wa.me/${yourWhatsAppNumber}?text=${message}`, '_blank');
    
    // Clear the cart after order
    localStorage.removeItem('cart');
    setCartItems([]);
    
    // ADDED: Shouts to Navbar that the cart is completely empty now!
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // UI if cart is empty
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        {/* Same fixed wrapper here! */}
        <div style={{ backgroundColor: '#FDECE4', width: '100%', minHeight: '100vh', padding: '100px 0' }}></div>
        <div style={{ textAlign: 'center', padding: '100px', minHeight: '60vh' }}>
          <h2 style={{ fontFamily: '"Times New Roman", Times, serif', color: '#2D2522' }}>Your cart is empty</h2>
          <Link to="/collections/our-best-sellers" style={{ color: '#D4813B', textDecoration: 'none', fontWeight: 'bold' }}>Continue Shopping</Link>
        </div>
      </>
    );
  }

  // Normal UI
  return (
    <>
      <Navbar />
{/* 1. THE FIXED WRAPPER: minHeight instead of maxHeight, and padding for top/bottom spacing */}
      <div style={{ backgroundColor: '#FDECE4', width: '100%', minHeight: '100vh', padding: '40px 0' }}>
        
        {/* 2. THE INNER CONTAINER: Changed margin from '40px auto' to '0 auto' to stop the white gap */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', color: '#2D2522' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontFamily: '"Times New Roman", Times, serif' }}>Your Cart</h1>
        
        {/* The List of Items */}
        <div style={{ marginBottom: '40px' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EED8C0', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{item.title}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#7A6B63' }}>Qty: {item.qty}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Rs. {(parseFloat(item.newPrice.replace(/,/g, '')) * item.qty).toFixed(2)}</p>
                <button onClick={() => removeItem(item.id)} style={{ color: '#D12E2E', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>Remove</button>
              </div>
            </div>
          ))}
          <h2 style={{ textAlign: 'right', fontFamily: '"Times New Roman", Times, serif' }}>Total: Rs. {totalPrice.toFixed(2)}</h2>
        </div>

        {/* The Checkout Form */}
        <div style={{ background: '#FAF7F5', padding: '40px', borderRadius: '8px', border: '1px solid #EED8C0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontFamily: '"Times New Roman", Times, serif', fontSize: '24px' }}>Shipping Details</h3>
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} required style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }} />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} required style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }} />
            <textarea name="address" placeholder="Full Delivery Address" onChange={handleInputChange} required rows="3" style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit' }} />
            
            <button type="submit" style={{ padding: '18px', background: '#25D366', color: 'white', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Place Order via WhatsApp
            </button>
          </form>
        </div>
      </div>
     </div>
    </>
  );
}