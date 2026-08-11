import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import './style.css'
import bgImg from '../assets/bgImg.jpeg'






export function LandingPage({ products, loading }){

    // 1. Search through the products array passed from App.jsx
    const featuredProduct = products.find(item => item.isFeatured === true);

    return(
       <>
        
        <Navbar />
        <main>

          <section className="hero-banner">
            <img className="background-image"  src={bgImg}/>
            <div className="hero-content">
                <h1>The Perfect Gifts Start Here</h1>
                <Link to="/collections/our-best-sellers" className="view-all-button">
                 SHOP NOW
                </Link>{/* <button>SHOP NOW</button> */}
            </div>
          </section>

                    {/* ================= THE "SMALL THINGS" (Store Perks) ================= */}
            <section className="store-perks-section">
            <div className="perks-container">
                <div className="perk-item">
                <span className="perk-icon">🚚</span>
                <h4 className="perk-title">Pan India Delivery</h4>
                <p className="perk-desc">Fast & secure shipping across the country.</p>
                </div>
                
                <div className="perk-item">
                <span className="perk-icon">🎁</span>
                <h4 className="perk-title">Premium Packaging</h4>
                <p className="perk-desc">Every order is packed like a luxury gift.</p>
                </div>
                
                <div className="perk-item">
                <span className="perk-icon">✨</span>
                <h4 className="perk-title">Handcrafted with Love</h4>
                <p className="perk-desc">Curated items chosen for maximum joy.</p>
                </div>
            </div>
            </section>


            {/* ================= FEATURED SINGLE PRODUCT ================= */}
            {!loading && featuredProduct && (
            <section className="featured-single-product">
              <div className="featured-container">
                {/* Left Side: Big Image (UPDATED to use database image) */}
                <div className="featured-image-wrapper">
                <img 
                    src={featuredProduct.image} 
                    alt={featuredProduct.title} 
                    className="featured-image"
                />
                </div>

                {/* Right Side: Text & Button (UPDATED to use database text) */}
                <div className="featured-text-wrapper">
                <span className="featured-subtitle">Our Top Pick</span>
                
                <h2 className="featured-title">{featuredProduct.title} 🎀✨</h2>
                
                <p className="featured-description">
                    {featuredProduct.description}
                </p>
                
                <div className="featured-price">Rs. {featuredProduct.newPrice}</div>
                
                {/* Dynamic link to the product page */}
                <Link to={`/products/${featuredProduct.id}`} className="featured-shop-btn">
                    Shop This Item
                </Link>
                </div>
              </div>
            </section>
            )}


            <section className="about-us">
                <h2>YOUR'S gifting & jewellery</h2>
                <p>At Yours Gifting & Jewellery, we bring together...</p>
                
                {/*                 
                  <ul className="contact-details">
                    <li>Email id- yours.business2701@gmail.com</li>
                    <li>Insta- @yours.official.in</li>
                  </ul> */}

                  <ul className="contact-details">
                    <li>
                        Contact No- <a href="tel:+919244740820" style={{ color: 'inherit', textDecoration: 'underline' }}>9244740820</a>, <a href="tel:+919873338272" style={{ color: 'inherit', textDecoration: 'underline' }}>9873338272</a>
                    </li>
                    <li>
                        Email id- <a href="mailto:amberandsol14@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>amberandsol14@gmail.com</a>
                    </li>
                    <li>
                        Insta- <a href="https://www.instagram.com/amberandsol14?igsh=MTEwM2U4YXJjbjByNw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>@amberandsol14</a>
                    </li>
                  </ul>
            </section>
        </main>

        <footer>
            <div className="social-links">
            {/* <a href="instagram-link">Instagram Icon</a> */}
            </div>
        </footer>
      </>

    )
        
}