import React, { useState } from 'react';
const imageModules = import.meta.glob('./assets/{bd,rak}*.{png,jpg,jpeg,svg,webp}', { eager: true });

// 2. Separate URLs into clean arrays based on their file prefix
const birthdayImages = [];
const rakhiImages = [];

Object.entries(imageModules).forEach(([path, module]) => {
  const fileName = path.split('/').pop();
  if (fileName.startsWith('bd')) {
    birthdayImages.push(module.default);
  } else if (fileName.startsWith('rak')) {
    rakhiImages.push(module.default);
  }
});

// 1. ADD THIS LINE RIGHT HERE:
const PLACEHOLDER = "https://via.placeholder.com/600x800?text=More+Images+Soon";


export const ALL_PRODUCTS = [
  // --- BIRTHDAY CATEGORY (5 Products) ---
  {
    id: 1,
    title: "Blush Birthday Hamper 🎂",
    category: "Birthday",
    image: birthdayImages[0] || PLACEHOLDER,
    oldPrice: "2,899.00",
    newPrice: "2,699.00",
    sale: true,
    description: "The perfect blush-themed birthday surprise. Includes a scented candle, bath bombs, a scrunchie set, and sweet treats.",
    images: [birthdayImages[0] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 2,
    title: "Premium Birthday Box ✨",
    category: "Birthday",
    image: birthdayImages[1] || PLACEHOLDER,
    oldPrice: "1,499.00",
    newPrice: "1,199.00",
    sale: false,
    description: "A premium assortment of birthday goodies guaranteed to make their special day even brighter.",
    images: [birthdayImages[1] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 3,
    title: "Midnight Confetti Box 🎉",
    category: "Birthday",
    image: birthdayImages[2] || PLACEHOLDER,
    oldPrice: "1,299.00",
    newPrice: "999.00",
    sale: true,
    description: "Start the celebration at midnight! Packed with fun party props, chocolates, and a special birthday mug.",
    images: [birthdayImages[2] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 4,
    title: "Sweet Sixteen Hamper 🎀",
    category: "Birthday",
    image: birthdayImages[3] || PLACEHOLDER,
    oldPrice: "2,199.00",
    newPrice: "1,899.00",
    sale: true,
    description: "Specially curated for a 16th birthday, featuring cute stationery, beauty accessories, and delicious snacks.",
    images: [birthdayImages[3] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 5,
    title: "Golden Celebration Box 👑",
    category: "Birthday",
    image: birthdayImages[4] || PLACEHOLDER,
    oldPrice: null,
    newPrice: "3,499.00",
    sale: false,
    description: "Our most luxurious birthday box featuring golden-themed accessories, gourmet chocolates, and a personalized frame.",
    images: [birthdayImages[4] || PLACEHOLDER, PLACEHOLDER]
  },

  // --- RAKHI CATEGORY (5 Products) ---
  {
    id: 6,
    title: "Rakhi Treasure Hamper 💖",
    category: "Rakhi",
    image: rakhiImages[0] || PLACEHOLDER,
    oldPrice: null,
    newPrice: "1,299.00",
    sale: false,
    description: "Celebrate the bond of love with this premium Rakhi Treasure Hamper. Includes assorted chocolates and a designer Rakhi.",
    images: [rakhiImages[0] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 7,
    title: "Rakhi Floral Thread 🌸",
    category: "Rakhi",
    image: rakhiImages[1] || PLACEHOLDER,
    oldPrice: "499.00",
    newPrice: "349.00",
    sale: true,
    description: "A beautifully handcrafted floral Rakhi thread that symbolizes elegance and tradition.",
    images: [rakhiImages[1] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 8,
    title: "Bhaiya-Bhabhi Rakhi Set 👫",
    category: "Rakhi",
    image: rakhiImages[2] || PLACEHOLDER,
    oldPrice: "899.00",
    newPrice: "749.00",
    sale: true,
    description: "A matching Lumba and Rakhi set to celebrate the beautiful bond with your brother and sister-in-law.",
    images: [rakhiImages[2] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 9,
    title: "Kids Spiderman Rakhi 🕸️",
    category: "Rakhi",
    image: rakhiImages[3] || PLACEHOLDER,
    oldPrice: "299.00",
    newPrice: "199.00",
    sale: true,
    description: "A fun and quirky superhero Rakhi sure to bring a smile to your little brother's face.",
    images: [rakhiImages[3] || PLACEHOLDER, PLACEHOLDER]
  },
  {
    id: 10,
    title: "Silver Swastik Rakhi 🕉️",
    category: "Rakhi",
    image: rakhiImages[4] || PLACEHOLDER,
    oldPrice: null,
    newPrice: "999.00",
    sale: false,
    description: "An auspicious 925 silver Rakhi featuring a Swastik design for good luck and prosperity.",
    images: [rakhiImages[4] || PLACEHOLDER, PLACEHOLDER]
  }
];