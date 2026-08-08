import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS } from '../constants'; 
import Navbar from './Navbar';
// You no longer need BestSeller.css if you put the layout CSS in your main file!

export function BestSeller() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // NEW: State for sorting
  const [sortOrder, setSortOrder] = useState('default');

  // NEW: Automatically pulls all unique categories from constants!
  const allCategories = ['All', ...new Set(ALL_PRODUCTS.map(product => product.category))];

  // NEW: Filters AND Sorts the products dynamically
  const displayedProducts = useMemo(() => {
    let result = ALL_PRODUCTS;

    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => parseFloat(a.newPrice.replace(/,/g, '')) - parseFloat(b.newPrice.replace(/,/g, '')));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => parseFloat(b.newPrice.replace(/,/g, '')) - parseFloat(a.newPrice.replace(/,/g, '')));
    }

    return result;
  }, [activeCategory, sortOrder]);

  return (
    <>
      <Navbar />

      {/* The Vibrant Background Wrapper */}
      <div className="search-page-wrapper">
        
        {/* We reuse the Search page CSS classes here for a perfect, uniform layout! */}
        <div className="search-page-container">
          
{/*           <header className="search-header">
            <h1>Our Best Sellers</h1>
          </header> */}

          <div className="search-layout">
            
            {/* === 1. LEFT SIDEBAR (Categories) === */}
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

            {/* === 2. RIGHT SIDE (Toolbar + Products) === */}
            <main className="search-results">
              
              {/* THIS IS THE FIX: The Toolbar pushes Sort to the right! */}
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