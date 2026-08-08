import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { ALL_PRODUCTS } from '../constants'; // Adjust path if needed
import '../style/SearchPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // States for our Sidebar Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  // 1. DYNAMICALLY GENERATE CATEGORIES
  // This automatically finds all unique categories in your database!
  const allCategories = ['All', ...new Set(ALL_PRODUCTS.map(product => product.category))];

  // 2. THE MASTER SEARCH & FILTER ALGORITHM
  // useMemo ensures this heavy math only runs when filters actually change
  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;

    // A. Filter by Search Query (Checks title AND category)
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    }

    // B. Filter by Sidebar Category
    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    // C. Sort by Price
    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => parseFloat(a.newPrice.replace(/,/g, '')) - parseFloat(b.newPrice.replace(/,/g, '')));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => parseFloat(b.newPrice.replace(/,/g, '')) - parseFloat(a.newPrice.replace(/,/g, '')));
    }

    return result;
  }, [query, activeCategory, sortOrder]);

  return (
    <>
      <Navbar />
      
      {/* The Full-Page Vibrant Background */}
      <div className="search-page-wrapper">
        <div className="search-page-container">
          
          {/* Header Section */}
          <header className="search-header">
            <h1>Search Results</h1>
            <p>Showing results for: <strong>"{query}"</strong></p>
          </header>

{/* Main Layout: Sidebar + Grid */}
          <div className="search-layout">
            
            {/* === LEFT SIDEBAR: FILTERS === */}
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

            {/* === RIGHT SIDE: PRODUCT GRID === */}
            <main className="search-results">
              
              {/* NEW: Dynamic Toolbar (Count on left, Sort on right) */}
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

              {/* The Product Grid */}
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