import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import './style.css'
import bgImg from '../assets/bgImg.jpeg'
import bd3 from '../assets/bd3.jpeg'





export function LandingPage(){

    return(
       <>

       <h3>To sho it's working...</h3>
        
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
            <section className="featured-single-product">
            <div className="featured-container">
                {/* Left Side: Big Image */}
                <div className="featured-image-wrapper">
                <img 
                    src={bd3}/* "https://via.placeholder.com/600x600"  */
                    alt="Glow & Glam Luxury Hamper" 
                    className="featured-image"
                />
                </div>

                {/* Right Side: Text & Button */}
                <div className="featured-text-wrapper">
                <span className="featured-subtitle">Our Top Pick</span>
                <h2 className="featured-title">Glow & Glam Luxury Hamper 🎀✨</h2>
                <p className="featured-description">
                    Curated with love, this premium hamper is the perfect surprise for your special someone. Includes handcrafted chocolates, a luxury candle, and a personalized note, all packed in our signature ribbon box.
                </p>
                <div className="featured-price">Rs. 2,599.00</div>
                
                {/* Assuming you want this to link to its specific product page */}
                <Link to="/products/3" className="featured-shop-btn">
                    Shop This Hamper
                </Link>
                </div>
            </div>
            </section>


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