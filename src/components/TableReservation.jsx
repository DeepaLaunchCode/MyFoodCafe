import React, { useState } from 'react';
import './TableReservation.css';

function TableReservation() {
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    guests: 1,
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    // Check for any non-empty error messages
    const hasErrors = Object.values(errors).some((error) => error !== '');
    // Check if any required field is empty
    const hasEmptyFields =
      !reservation.date ||
      !reservation.time ||
      !reservation.guests ||
      !reservation.name ||
      !reservation.phone;
    return hasErrors || hasEmptyFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      date: validateField('date', reservation.date),
      time: validateField('time', reservation.time, reservation),
      guests: validateField('guests', reservation.guests),
      name: validateField('name', reservation.name),
      phone: validateField('phone', reservation.phone),
    };
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== '')) {
      alert('Please fix the errors in the form.');
      return;
    }

    // Simulate saving to a JSON file
    try {
      const response = await fetch('/reservations.json');
      let existingReservations = [];
      try {
        existingReservations = await response.json();
      } catch (error) {
        console.warn('reservations.json is empty or invalid, starting with an empty array.');
      }

      const newReservation = { ...reservation, id: Date.now() };
      const updatedReservations = [...existingReservations, newReservation];

      console.log('Simulating saving reservation:', updatedReservations);
      setReservation({ date: '', time: '', guests: 1, name: '', phone: '' });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Error submitting reservation.');
    }
  };

  return (
    <div className="table-reservation-container">
      <h2>Table Reservation</h2>
      {isSubmitted && (
        <div className="thank-you-message">
          Thank you, we have received your request for table reservation! We will get back to you soon.
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
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <button
          type="submit"
          className={`reserve-button ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitDisabled()}
        >
          Reserve Table
        </button>
      </form>
    </div>
  );
}

export default TableReservation;