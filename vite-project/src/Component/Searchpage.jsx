import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/Searchpage.css';

// 1. Import Firebase instead of ALL_PRODUCTS
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // 2. New State for Firebase Products
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

  // 4. Dynamically generate categories from CLOUD data
  const allCategories = ['All', ...new Set(products.map(product => product.category))];

  // 5. Update the master search algorithm to use 'products' state
  const filteredProducts = useMemo(() => {
    let result = products;

    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(product => 
        (product.title && product.title.toLowerCase().includes(lowerQuery)) ||
        (product.category && product.category.toLowerCase().includes(lowerQuery))
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => parseFloat(String(a.newPrice).replace(/,/g, '')) - parseFloat(String(b.newPrice).replace(/,/g, '')));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => parseFloat(String(b.newPrice).replace(/,/g, '')) - parseFloat(String(a.newPrice).replace(/,/g, '')));
    }

    return result;
  }, [products, query, activeCategory, sortOrder]);

  // Show a loading screen while fetching
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem" }}>
          Searching for gifts...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="search-page-wrapper">
        <div className="search-page-container">
          
          <header className="search-header">
            <h1>Search Results</h1>
            <p>Showing results for: <strong>"{query}"</strong></p>
          </header>

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
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
                
                <div className="sort-container">
                  <label htmlFor="sortOrder">Sort by:</label>
                  <select 
                    id="sortOrder"
                    className="sort-dropdown"
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="default">Relevance</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
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
              ) : (
                <div className="no-results">
                  <h2>No products found</h2>
                  <p>Try checking your spelling or using less specific keywords.</p>
                  <button className="reset-btn" onClick={() => { setActiveCategory('All'); setSortOrder('default'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </main>
            
          </div>
        </div>
      </div>
    </>
  );
}