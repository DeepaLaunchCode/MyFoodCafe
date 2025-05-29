import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './OrderOnline.css';

function OrderOnline() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [order, setOrder] = useState({
    items: [],
    address: {
      street: '',
      city: '',
      zip: '',
    },
    payment: {
      cardnumber: '',
      expiry: '',
      cvv: '',
    },
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    street: '',
    city: '',
    zip: '',
    cardnumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch('/menu.json');
        const data = await response.json();
        setMenuItems(data);
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

  const detailsRef = useRef(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddItem = (item) => {
    const quantity = parseInt(document.getElementById(`itemcount-${item.id}`).value) || 1;
    setOrder(prevOrder => ({
      ...prevOrder,
      items: [...prevOrder.items, { ...item, quantity }],
    }));
    scrollToDetails();
  };

  const handleRemoveItem = (index) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      items: prevOrder.items.filter((_, i) => i !== index),
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'street':
        if (!value || value.length < 3) {
          errorMsg = 'Street must be at least 3 characters long';
        }
        break;
      case 'city':
        if (!value || !/^[a-zA-Z\s-]+$/.test(value)) {
          errorMsg = 'City must contain only letters, spaces, or hyphens';
        }
        break;
      case 'zip':
        if (!/^\d{5}(-\d{4})?$/.test(value)) {
          errorMsg = 'ZIP code must be 5 digits or 5+4 digits (e.g., 12345 or 12345-6789)';
        }
        break;
      case 'cardnumber':
        if (!/^\d{13,19}$/.test(value.replace(/\s/g, ''))) {
          errorMsg = 'Card number must be 13-19 digits';
        }
        break;
      case 'expiry':
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          errorMsg = 'Expiry date must be in MM/YY format';
        } else {
          const [month, year] = value.split('/').map(Number);
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100; // Last two digits
          const currentMonth = currentDate.getMonth() + 1; // 1-12
          const expiryYear = Number(`20${year}`);
          if (
            expiryYear < currentDate.getFullYear() ||
            (expiryYear === currentDate.getFullYear() && month < currentMonth)
          ) {
            errorMsg = 'Expiry date must be in the future';
          }
        }
        break;
      case 'cvv':
        if (!/^\d{3,4}$/.test(value)) {
          errorMsg = 'CVV must be 3 or 4 digits';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      address: {
        ...prevOrder.address,
        [name]: value,
      },
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      payment: {
        ...prevOrder.payment,
        [name]: value,
      },
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  // Check if the submit button should be disabled
  const isSubmitDisabled = () => {
    // Check for any non-empty error messages
    const hasErrors = Object.values(errors).some(error => error !== '');
    // Check if any required field is empty
    const hasEmptyFields =
      !order.address.street ||
      !order.address.city ||
      !order.address.zip ||
      !order.payment.cardnumber ||
      !order.payment.expiry ||
      !order.payment.cvv;
    return hasErrors || hasEmptyFields;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      street: validateField('street', order.address.street),
      city: validateField('city', order.address.city),
      zip: validateField('zip', order.address.zip),
      cardnumber: validateField('cardnumber', order.payment.cardnumber),
      expiry: validateField('expiry', order.payment.expiry),
      cvv: validateField('cvv', order.payment.cvv),
    };
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      alert('Please fix the errors in the form.');
      return;
    }

    console.log('Order submitted:', order);
    setIsOrderSubmitted(true);
    setOrder({
      items: [],
      address: { street: '', city: '', zip: '' },
      payment: { cardnumber: '', expiry: '', cvv: '' },
    });
    setTimeout(() => {
      setIsOrderSubmitted(false);
    }, 5000);
    setShowAddressForm(false);
  };

  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-screen">
      {/* Menu Frame */}
      <div className="w-1/2 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">Order Online</h2>
        <div className="menu-container">
          <h3 className="text-2xl font-semibold mb-4">Menu</h3>
          <div className="category-buttons flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="menu-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map(item => (
              <div key={item.id} className="menu-item bg-white p-4 rounded shadow">
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
                    className="w-full h-40 object-cover rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-800 font-medium">Price: ${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    id={`itemcount-${item.id}`}
                    className="border rounded px-2 py-1"
                  >
                    {[...Array(10).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddItem(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Frame */}
      <div className={`w-1/2 bg-white p-4 ${order.items.length === 0 ? 'hidden' : 'block'} overflow-y-auto`}>
        <div ref={detailsRef} className="order-summary">
          <h3 className="text-2xl font-bold mb-4">Your Order</h3>
          {isOrderSubmitted && (
            <div className="thank-you-message">
              Thank you for your order! Your order is submitted successfully and on the way!
            </div>
          )}

          {order.items.length === 0 ? (
            <p className="text-gray-600">Your order is empty.</p>
          ) : (
            <>
              <ul className="mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 border-b">
                    <span>{item.name} (x{item.quantity})</span>
                    <div>
                      <span className="mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>

        {showAddressForm && (
          <div className="address-form mt-6">
            <h3 className="text-xl font-bold mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-gray-700">Street:</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={order.address.street}
                  onChange={handleAddressChange}
                  className={`w-full border rounded px-3 py-2 ${errors.street ? 'border-red-500' : ''}`}
                  required
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-gray-700">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={order.address.city}
                  onChange={handleAddressChange}
                  className={`w-full border rounded px-3 py-2 ${errors.city ? 'border-red-500' : ''}`}
                  required
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="zip" className="block text-gray-700">Zip Code:</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={order.address.zip}
                  onChange={handleAddressChange}
                  className={`w-full border rounded px-3 py-2 ${errors.zip ? 'border-red-500' : ''}`}
                  required
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
              </div>
              <div>
                <label htmlFor="cardnumber" className="block text-gray-700">Card Number:</label>
                <input
                  type="text"
                  id="cardnumber"
                  name="cardnumber"
                  value={order.payment.cardnumber}
                  onChange={handlePaymentChange}
                  className={`w-full border rounded px-3 py-2 ${errors.cardnumber ? 'border-red-500' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardnumber && <p className="text-red-500 text-sm mt-1">{errors.cardnumber}</p>}
              </div>
              <div>
                <label htmlFor="expiry" className="block text-gray-700">Expiry Date:</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={order.payment.expiry}
                  onChange={handlePaymentChange}
                  className={`w-full border rounded px-3 py-2 ${errors.expiry ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                  required
                />
                {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="cvv" className="block text-gray-700">CVV:</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={order.payment.cvv}
                  onChange={handlePaymentChange}
                  className={`w-full border rounded px-3 py-2 ${errors.cvv ? 'border-red-500' : ''}`}
                  placeholder="123"
                  required
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
              <button
                onClick={handleSubmitOrder}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitDisabled()}
              >
                Submit Order (Dummy Payment)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderOnline;