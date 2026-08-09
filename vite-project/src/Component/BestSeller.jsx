import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

// 1. Import Firebase tools (Make sure the path to firebase.js is correct!)
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
// Notice we removed: import { ALL_PRODUCTS } from '../constants';

export function BestSeller() {
  // 2. New State for Firebase Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  // 3. Fetch data from Firebase when the page loads
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

  // 4. Now this pulls categories dynamically from your CLOUD data!
  const allCategories = ['All', ...new Set(products.map(product => product.category))];

  // 5. Update useMemo to look at the 'products' state instead of ALL_PRODUCTS
  const displayedProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    if (sortOrder === 'low-high') {
      // Wrapped in String() just in case the database saved it as a raw number
      result = [...result].sort((a, b) => parseFloat(String(a.newPrice).replace(/,/g, '')) - parseFloat(String(b.newPrice).replace(/,/g, '')));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => parseFloat(String(b.newPrice).replace(/,/g, '')) - parseFloat(String(a.newPrice).replace(/,/g, '')));
    }

    return result;
  }, [products, activeCategory, sortOrder]);

  // Show a loading screen while waiting for the cloud
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem" }}>
          Loading amazing gifts...
        </div>
      </>
    );
  }

  // 6. Your layout remains EXACTLY the same!
  return (
    <>
      <Navbar />

      <div className="search-page-wrapper">
        <div className="search-page-container">
          <div className="search-layout">
            
            {/* === LEFT SIDEBAR === */}
            <aside className="search-sidebar">
              <div className="filter-group">
                <h3>Categories</h3>
                <ul className="filter-list">
                  {allCategories.map(category => (
                    <li key={category}>
                      <button 
                        className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* === RIGHT SIDE === */}
            <main className="search-results">
              
              <div className="results-toolbar">
                <span className="product-count">
                  {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'}
                </span>
                
                <div className="sort-container">
                  <label htmlFor="collectionSort">Sort by:</label>
                  <select 
                    id="collectionSort"
                    className="sort-dropdown"
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="default">Featured</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* The Product Grid */}
              <div className="product-grid">
                {displayedProducts.map((product) => (
                  <article key={product.id} className="product-card">
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card-image-wrapper">
                        <img src={product.image} alt={product.title} />
                        {product.sale && <span className="sale-badge">Sale</span>}
                      </div>
                      <div className="card-info">
                        <h3 className="card-title">{product.title}</h3>
                        <div className="card-pricing">
                          <span className="current-price">Rs. {product.newPrice}</span>
                          {product.oldPrice && <span className="old-price">Rs. {product.oldPrice}</span>}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}