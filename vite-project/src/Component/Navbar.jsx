import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false); 
  
  // NEW: State to track the number of items in the cart
  const [cartCount, setCartCount] = useState(0);
  
  const navigate = useNavigate();

  // NEW: Function to check LocalStorage and calculate total items
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Adds up the 'qty' of every item in the cart
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    // 1. Check the cart when the Navbar first loads
    updateCartCount();

    // 2. Listen for a custom event (we will add this to your Product Page next!)
    window.addEventListener('cartUpdated', updateCartCount);

    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== '') {
      navigate(`/search?q=${searchInput}`);
      setSearchInput('');
      setIsSearchActive(false); 
    }
  };

  return (
    <header className={`global-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="announcement-bar">
        <span>Welcome to our store | Free shipping over Rs. 999</span>
      </div>

      <nav className="main-nav">
        
        {isSearchActive ? (
          
          /* === THE ACTIVE SEARCH BAR === */
          <div className="active-search-container">
            <form onSubmit={handleSearchSubmit} className="expanded-search-form">
              <button type="submit" className="svg-btn">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              
              <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="expanded-search-input"
                autoFocus 
              />
              
              <button type="button" className="svg-btn" onClick={() => setIsSearchActive(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </form>
          </div>

        ) : (

          /* === THE NORMAL NAVBAR === */
          <>
            <div className="nav-left">
              <button className="svg-btn" onClick={() => setIsSearchActive(true)}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </div>
          
            <div className="nav-center">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span className="brand-name">Amber & Sol</span>
              </Link>
            </div>

            <div className="nav-right">
              <Link to="/cart" style={{ textDecoration: 'none' }}>
                {/* NEW: Wrapper for the cart icon and badge */}
                <div className="cart-icon-wrapper">
                  <button className="svg-btn">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </button>
                  
                  {/* Only show the badge if there are items in the cart! */}
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>
              </Link>
            </div>
          </>

        )}
      </nav>
    </header>
  );
}