import React, { useState } from 'react';
import '../assets/css/TableReservation.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function TableReservation() {
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const validateField = (name, value, allValues = reservation) => {
    let errorMsg = '';
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = currentDate.toTimeString().slice(0, 5); // HH:MM

    switch (name) {
      case 'date':
        if (!value) {
          errorMsg = 'Date is required';
        } else if (value < today) {
          errorMsg = 'Date must be in the future';
        }
        break;
      case 'time':
        if (!value) {
          errorMsg = 'Time is required';
        }
        break;
      case 'guests':
        if (!value || value < 1 || value > 20) {
          errorMsg = 'Guests must be between 1 and 20';
        }
        break;
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
      case 'phone':
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          errorMsg = 'Phone must be a 10-digit number';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation({ ...reservation, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const isSubmitDisabled = () => {
    const hasErrors = Object.values(errors).some((error) => error !== '');
    const hasEmptyFields =
      !reservation.date ||
      !reservation.time ||
      !reservation.guests ||
      !reservation.name ||
      !reservation.email ||
      !reservation.phone;
    return hasErrors || hasEmptyFields || isLoading; // Disable button during loading
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 

    // Validate all fields
    const newErrors = {
      date: validateField('date', reservation.date),
      time: validateField('time', reservation.time, reservation),
      guests: validateField('guests', reservation.guests),
      name: validateField('name', reservation.name),
      email: validateField('email', reservation.email),
      phone: validateField('phone', reservation.phone),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) {
      alert('Please fix the errors in the form.');
      return;
    }

    // Prepare payload for API
    const payload = {
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      reservationDate: reservation.date,
      reservationTime: `${reservation.time}:00`, // Append seconds to match HH:MM:SS
      numberOfGuests: parseInt(reservation.guests),
    };

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${apiUrl}/api/reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setReservationId(result.data);
        setIsSubmitted(true);
        setErrorMessage('');
        setReservation({ date: '', time: '', guests: 1, name: '', email: '', phone: '' });
        setErrors({ date: '', time: '', guests: '', name: '', email: '', phone: '' });
        setTimeout(() => {
          setIsSubmitted(false);
          setReservationId(null);
        }, 10000);
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
   const navigate = useNavigate(); // Get the navigate function

  const handleManageReservationClick = () => {
    navigate('/manage-reservation'); // Navigate to the specified route
  };

  return (
    <div className="table-reservation-container">
      <h2>Table Reservation</h2>
      <div style={{ marginTop: '5px' }}>
        <p>Already have a reservation?</p>
        <button 
        className="manage-reservation-button" // Add a class for styling
        onClick={handleManageReservationClick}
      >
        Manage Your Reservation
      </button>
      </div>
      {isSubmitted && reservationId && (
        <div className="thank-you-message">
          Thank you, we have received your request for table reservation! Your reservation ID is #{reservationId}. You will get notification on your phone and email for the same.
        </div>
      )}
      {errorMessage && (
        <div className="error-message text-red-500">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={reservation.date}
            onChange={handleChange}
            className={errors.date ? 'border-red-500' : ''}
            required
            disabled={isLoading} // Disable input during loading
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={reservation.time}
            onChange={handleChange}
            className={errors.time ? 'border-red-500' : ''}
            required
            disabled={isLoading}
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>
        <div>
          <label htmlFor="guests">Number of Guests:</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={reservation.guests}
            onChange={handleChange}
            min="1"
            max="20"
            className={errors.guests ? 'border-red-500' : ''}
            required
            disabled={isLoading}
          />
          {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={reservation.name}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            required
            disabled={isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={reservation.email}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
            required
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={reservation.phone}
            onChange={handleChange}
            className={errors.phone ? 'border-red-500' : ''}
            required
            disabled={isLoading}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <button
          type="submit"
          className={`reserve-button ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitDisabled()}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'Reserve Table'
          )}
        </button>
      </form>
    </div>
  );
}

export default TableReservation;