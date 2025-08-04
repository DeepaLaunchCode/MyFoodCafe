import React, { useState } from 'react';
import '../assets/css/ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '', // <-- ADD THIS
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'name':
        if (!value || value.length < 2) errorMsg = 'Name must be at least 2 characters long';
        break;
      case 'email':
        if (!value || !/^\S+@\S+\.\S+$/.test(value)) errorMsg = 'Please enter a valid email address';
        break;
      case 'message':
        if (!value || value.length < 10) errorMsg = 'Message must be at least 10 characters long';
        break;
      case 'category': // <-- ADD THIS VALIDATION CASE
        if (!value) errorMsg = 'Please select a category';
        break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  
  const isSubmitDisabled = () => {
    const hasErrors = Object.values(errors).some(e => e);
    const hasEmptyFields = !formData.name || !formData.email || !formData.message || !formData.category; // <-- ADD CATEGORY CHECK
    return hasErrors || hasEmptyFields || isSubmitting;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled()) {
      alert('Please complete all fields correctly.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Something went wrong with your submission.');

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '', category: '' }); // <-- RESET CATEGORY
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (error) {
      console.error('Submission Error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-us-container">
        <h2>Contact Us for Inquiries and Feedback:</h2>
        {isSubmitted && (
          <div className="thank-you-message">
            Thank you for your message! We will get back to you soon.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name and Email fields remain the same */}
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* ADD THE CATEGORY DROPDOWN */}
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'border-red-500' : ''}
              required
            >
              <option value="" disabled>-- Select a Category --</option>
              <option value="General Feedback">General Feedback</option>
              <option value="Franchise Enquiry">Franchise Enquiry</option>
              <option value="Complaint">Complaint</option>
              <option value="Catering Request">Catering Request</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          {/* Message field remains the same */}
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" required />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitDisabled()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      {/* Address section remains the same */}
      <div style={{textAlign: "center", marginTop: '2rem'}}>
        <h3>We are located at:</h3>
        <address>
          <p>123 Gourmet Avenue</p>
          <p>Culinary District, CA 90210</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: myfoodcafedemo@gmail.com</p>
        </address>
      </div>
    </>
  );
}

export default ContactUs;