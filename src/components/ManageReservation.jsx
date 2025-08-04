import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/TableReservation.css';

function ManageReservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservationId, setReservationId] = useState(null);
  const [manualIdInput, setManualIdInput] = useState('');
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const [editReservation, setEditReservation] = useState({
    date: '', time: '', guests: 1, name: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState({
    date: '', time: '', guests: '', name: '', email: '', phone: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setReservationId(id);
    } else {
      setIsLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (reservationId) {
      const fetchReservation = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
          const response = await fetch(`${apiUrl}/api/reservation/${reservationId}`);
          const result = await response.json();
          if (result.success && result.data) {
            setReservation(result.data);
            setEditReservation({
              date: result.data.reservationDate,
              time: result.data.reservationTime.substring(0, 5),
              guests: result.data.numberOfGuests,
              name: result.data.customer.name,
              email: result.data.customer.email,
              phone: result.data.customer.phone,
            });
          } else {
            setErrorMessage(result.message || 'Reservation not found.');
          }
        } catch (err) {
          setErrorMessage(`Error: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReservation();
    }
  }, [reservationId]);

  const validateField = (name, value) => {
    let errorMsg = '';
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];

    switch (name) {
      case 'date':
        if (!value) errorMsg = 'Date is required';
        else if (value < today) errorMsg = 'Date must be today or in the future';
        break;
      case 'time':
        if (!value) errorMsg = 'Time is required';
        break;
      case 'guests':
        if (!value || value < 1 || value > 20) errorMsg = 'Guests must be between 1 and 20';
        break;
      case 'name':
        if (!value || value.length < 2) errorMsg = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value || !/^\S+@\S+\.\S+$/.test(value)) errorMsg = 'Enter a valid email';
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) errorMsg = 'Phone must be 10 digits';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReservation({ ...editReservation, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      date: validateField('date', editReservation.date),
      time: validateField('time', editReservation.time),
      guests: validateField('guests', editReservation.guests),
      name: validateField('name', editReservation.name),
      email: validateField('email', editReservation.email),
      phone: validateField('phone', editReservation.phone),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      alert('Fix errors before submitting.');
      return;
    }

    const payload = {
      name: editReservation.name,
      email: editReservation.email,
      phone: editReservation.phone,
      reservationDate: editReservation.date,
      reservationTime: `${editReservation.time}:00`,
      numberOfGuests: parseInt(editReservation.guests),
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/reservation/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        alert('Reservation updated.');
        setIsEditing(false);
        navigate(`/manage-reservation?id=${reservationId}`);
      } else {
        setErrorMessage(result.message || 'Update failed.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Cancel this reservation?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/reservation/${reservationId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        alert('Reservation cancelled.');
        setReservation(null);
        navigate('/reservetable');
      } else {
        setErrorMessage(result.message || 'Cancel failed.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualIdInput.trim()) {
      navigate(`/manage-reservation?id=${manualIdInput.trim()}`);
    }
  };

  // ----------------- Render ------------------

  if (isLoading) return <div className="table-reservation-container">Loading...</div>;

  if (!reservationId) {
    return (
      <div className="table-reservation-container">
        <h2>Enter Reservation ID</h2>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            placeholder="Reservation ID"
            value={manualIdInput}
            onChange={(e) => setManualIdInput(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }

  if (errorMessage) {
    return <div className="table-reservation-container error-message">{errorMessage}</div>;
  }

  if (!reservation) {
    return <div className="table-reservation-container">No reservation found for ID: {reservationId}</div>;
  }

  return (
    <div className="table-reservation-container">
      <h2>Manage Your Reservation</h2>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <h3>Edit Reservation (ID: {reservation.id})</h3>

          <div>
            <label>Date:</label>
            <input type="date" name="date" value={editReservation.date} onChange={handleChange} required />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
          </div>

          <div>
            <label>Time:</label>
            <input type="time" name="time" value={editReservation.time} onChange={handleChange} required />
            {errors.time && <p className="text-red-500">{errors.time}</p>}
          </div>

          <div>
            <label>Guests:</label>
            <input type="number" name="guests" value={editReservation.guests} onChange={handleChange} required />
            {errors.guests && <p className="text-red-500">{errors.guests}</p>}
          </div>

          <div>
            <label>Name:</label>
            <input type="text" name="name" value={editReservation.name} onChange={handleChange} required />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label>Email:</label>
            <input type="email" name="email" value={editReservation.email} onChange={handleChange} required />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label>Phone:</label>
            <input type="tel" name="phone" value={editReservation.phone} onChange={handleChange} required />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <button type="submit" disabled={isLoading}>Update</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div className="reservation-details">
          <h3>Reservation ID: {reservation.id}</h3>
          <p><strong>Date:</strong> {reservation.reservationDate}</p>
          <p><strong>Time:</strong> {reservation.reservationTime}</p>
          <p><strong>Guests:</strong> {reservation.numberOfGuests}</p>
          <p><strong>Name:</strong> {reservation.customer.name}</p>
          <p><strong>Email:</strong> {reservation.customer.email}</p>
          <p><strong>Phone:</strong> {reservation.customer.phone}</p>
 <div className="button-group">
          <button onClick={() => setIsEditing(true)} className="reserve-button">Edit</button>
          <button onClick={handleDelete} disabled={isLoading} className="delete-button">Cancel Reservation</button>
       </div></div>
      )}
    </div>
  );
}

export default ManageReservation;