import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
    import './Menu.css';

    function Menu() {
      const [menuItems, setMenuItems] = useState([]);
      const [selectedCategory, setSelectedCategory] = useState('all');
      const [categories, setCategories] = useState([]);

      useEffect(() => {
        async function fetchMenu() {
          try {
            const response = await fetch('/menu.json');
            const data = await response.json();
            setMenuItems(data);

            // Extract unique categories
            const uniqueCategories = ['all', ...new Set(data.map(item => item.category))];
            setCategories(uniqueCategories);
          } catch (error) {
            console.error('Error fetching menu:', error);
          }
        }
        fetchMenu();
      }, []);

      const filteredMenuItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);
    
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
        src={item.image}
        alt={item.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
                
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default Menu;
