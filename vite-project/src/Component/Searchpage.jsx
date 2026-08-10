import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/Searchpage.css';

// 1. Notice: No Firebase imports here anymore!

// 2. Accept products and loading as props from App.jsx
export default function SearchPage({ products, loading }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  // 3. Added Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  // Dynamically generate categories from CLOUD data
  const allCategories = ['All', ...new Set(products.map(product => product.category))];

  // The master search algorithm
  const filteredProducts = useMemo(() => {
    let result = products; // Uses the prop from App.jsx

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

  // Reset to Page 1 if the user searches a new word, changes category, or changes sort
  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory, sortOrder]);

  // 4. Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // We only show these specific 12 products on the screen
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Show a loading screen if App.jsx is still grabbing data on first load
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
                <>
                  <div className="product-grid">
                    {/* 5. Map over currentProducts instead of filteredProducts */}
                    {currentProducts.map((product) => (
                      <article key={product.id} className="product-card">
                        {/* 6. INSTANT LOAD: Pass the state to the Product Page */}
                        <Link to={`/products/${product.id}`} state={{ productData: product }} style={{ textDecoration: 'none' }}>
                          <div className="card-image-wrapper">
                            {/* 7. LAZY LOADING added here */}
                            <img src={product.image} alt={product.title} loading="lazy" />
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

                  {/* 8. Pagination Controls (Only show if there is more than 1 page of results) */}
                  {totalPages > 1 && (
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Previous
                      </button>
                      
                      <span style={{ fontWeight: 'bold' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
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