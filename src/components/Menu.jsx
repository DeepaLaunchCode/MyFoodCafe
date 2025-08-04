import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../assets/css/Menu.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  // Add a state for loading and errors for better UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
 

  useEffect(() => {
    async function fetchMenu() {
      try {
        // --- CHANGE 1: Point to your live Spring Boot API endpoint ---
        const response = await fetch(`${apiUrl}/api/menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMenuItems(data);

        // Extract unique categories from the API data
        const uniqueCategories = ['all', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);

      } catch (e) {
        console.error('Error fetching menu:', e);
        setError('Failed to load menu. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []); // The empty dependency array ensures this runs only once on mount

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);
  
  // Display loading or error states
  if (loading) {
    return <div className="menu-container"><h2>Loading menu...</h2></div>;
  }
  
  if (error) {
    return <div className="menu-container"><h2 style={{color: 'red'}}>{error}</h2></div>;
  }

  return (
    <div className="menu-container">
      <h2>Menu</h2>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div className="menu-grid">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="menu-item">
            <motion.div
              whileHover={{ scale: 1.1, opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <motion.img
                loading="lazy"
                // --- CHANGE 2: Use `item.imageUrl` to match the API response field ---
                src={`/assets/images/${item.imageUrl}`}
                alt={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;