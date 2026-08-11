import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/BestSeller.css';


export function BestSeller({ products, loading }) {
  // We ONLY need state for the UI now. No products state, no loading state!
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  // Dynamically pull categories from the global products prop
  const allCategories = ['All', ...new Set(products.map(product => product.category))];

  const displayedProducts = useMemo(() => {
    let result = products; // Using the prop!

    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => parseFloat(String(a.newPrice).replace(/,/g, '')) - parseFloat(String(b.newPrice).replace(/,/g, '')));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => parseFloat(String(b.newPrice).replace(/,/g, '')) - parseFloat(String(a.newPrice).replace(/,/g, '')));
    }

    return result;
  }, [products, activeCategory, sortOrder]);

  // Reset to Page 1 if the user changes the category or sort order
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortOrder]);

  // Pagination Math
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage);

  // If App.jsx says we are still loading, show this
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

  // If App.jsx is done loading, show the actual page!
 return (
    <>
      <Navbar />
      
      <div className="collection-wrapper">
        <div className="collection-page-layout">
          <div className="collection-content-wrapper">
            
            <aside className="sidebar-filters">
              <div className="filter-block">
                <h3>Categories</h3>
                <ul className="category-list">
                  {allCategories.map(category => (
                    <li key={category}>
                      <button 
                        className={activeCategory === category ? 'active' : ''}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <main className="main-products-area">
              
              <div className="collection-toolbar">
                <span className="product-count">
                  {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'}
                </span>
                
                {/* THE FIXED SORT SECTION */}
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

              <div className="product-grid">
                {currentProducts.map((product) => (
                  <article key={product.id} className="product-card">
                    <Link to={`/products/${product.id}`} state={{ productData: product }} className="product-link">
                      
                      {/* THE BLUR IMAGE TRICK */}
                      <div className="card-image-wrapper">
                         <img src={product.image} className="bg-blur" alt="" aria-hidden="true" />                       
                         <img src={product.image} className="fg-clear" alt={product.title} loading="lazy" />                  
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

              {totalPages > 1 && (
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
                  >
                    Previous
                  </button>
                  
                  <span style={{ fontWeight: '500', color: '#333' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
                  >
                    Next
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