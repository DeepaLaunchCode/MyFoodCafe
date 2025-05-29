import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'name':
        if (!value || value.length < 2) {
          errorMsg = 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
          errorMsg = 'Please enter a valid email address';
        }
        break;
      case 'message':
        if (!value || value.length < 10) {
          errorMsg = 'Message must be at least 10 characters long';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const isSubmitDisabled = () => {
    // Check for any non-empty error messages
    const hasErrors = Object.values(errors).some((error) => error !== '');
    // Check if any required field is empty
    const hasEmptyFields = !formData.name || !formData.email || !formData.message;
    return hasErrors || hasEmptyFields;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== '')) {
      alert('Please fix the errors in the form.');
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setErrors({ name: '', email: '', message: '' });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <>
      <div className="contact-us-container">
        <h2>Please write us for Catering / Franchise enquiries:</h2>
        {isSubmitted && (
          <div className="thank-you-message">
            Thank you for your message! We will get back to you soon.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={errors.message ? 'border-red-500' : ''}
              required
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className={`submit-button ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitDisabled()}
          >
            Submit
          </button>
        </form>
      </div>
      <div>
        <h3>We are located at:</h3>
        <address>
          <p>123 Gourmet Avenue</p>
          <p>Culinary District, CA 90210</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@myfoodcafe.com</p>
        </address>
      </div>
    </>
  );
}

export default ContactUs;