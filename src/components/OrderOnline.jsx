import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../assets/css/OrderOnline.css';
import { button } from 'framer-motion/client';

function OrderOnline() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
 
  const [order, setOrder] = useState({
    items: [],
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    payment: {
      cardnumber: '',
      expiry: '',
      cvv: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    cardnumber: '',
    expiry: '',
    cvv: '',
  });
  // Add a state for loading and errors for better UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to store the successful order ID
  const [submittedOrderId, setSubmittedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

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
  }, []);

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const detailsRef = useRef(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      case 'name':
        if (!value || value.length < 3) {
          errorMsg = 'Name must be at least 3 characters long';
        }
        break;
      case 'email':
        if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
          errorMsg = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          errorMsg = 'Phone must be a 10-digit number';
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

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      customer: {
        ...prevOrder.customer,
        [name]: value,
      },
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };
//onchage explicitly for expiry date
  const handleExpiryChange = (e) => {
  let { value } = e.target;

  // Remove all non-digit characters
  value = value.replace(/\D/g, '');

  // Format as MM/YY
  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }

  // Update order state
  setOrder(prevOrder => ({
    ...prevOrder,
    payment: {
      ...prevOrder.payment,
      expiry: value,
    },
  }));

  // Validate the formatted value
  setErrors(prevErrors => ({
    ...prevErrors,
    expiry: validateField('expiry', value),
  }));
};

//onchange for all remaining payment fields
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
      !order.customer.name ||
      !order.customer.email ||
      !order.customer.phone ||
      !order.payment.cardnumber ||
      !order.payment.expiry ||
      !order.payment.cvv;
    return hasErrors || hasEmptyFields || isSubmitting;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      name: validateField('name', order.customer.name),
      email: validateField('email', order.customer.email),
      phone: validateField('phone', order.customer.phone),
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

    // Order submission logic
    setIsSubmitting(true);

    const orderPayload = {
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      cardNumber: order.payment.cardnumber,
      expiryDate: order.payment.expiry,
      cvv: order.payment.cvv,
      totalAmount: totalPrice,
      items: order.items.map(item => ({
        itemName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error('Order submission failed');

      const result = await response.json();

      if (result.success && result.data) {
        setSubmittedOrderId(result.data);
        setIsOrderSubmitted(true);
        setOrder({
          items: [],
          customer: { name: '', email: '', phone: '' },
          payment: { cardnumber: '', expiry: '', cvv: '' },
        });
        setShowCustomerForm(false);
        setTimeout(() => {
          setIsOrderSubmitted(false);
          setSubmittedOrderId(null);
        }, 10000);
       
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`There was an error submitting your order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Display loading or error states
  if (loading) {
    return <div className="menu-container"><h2>Loading menu...</h2></div>;
  }

  if (error) {
    return <div className="menu-container"><h2 style={{ color: 'red' }}>{error}</h2></div>;
  }

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
                    src={`/assets/images/${item.imageUrl}`}
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
          {isOrderSubmitted && submittedOrderId && (
            <div className="thank-you-message">
              Thank you! Your order #{submittedOrderId} has been submitted successfully! You will get notification on your phone and email for the same.
            </div>
          )}



          {order.items.length === 0 ? (
           <> <p className="text-gray-600">Your order is empty.  </p>
             <button onClick={scrollToTop}>Go to menu</button>
             </>       
       

              
          )  : (
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
                onClick={() => setShowCustomerForm(true)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>

        {showCustomerForm && (
          <div className="address-form mt-6">
            <h3 className="text-xl font-bold mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={order.customer.name}
                  onChange={handleCustomerChange}
                  className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={order.customer.email}
                  onChange={handleCustomerChange}
                  className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700">Phone Number:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={order.customer.phone}
                  onChange={handleCustomerChange}
                  className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                  onChange={handleExpiryChange}
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
                {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'Submit Order'
          )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderOnline;