import React, { useState, useEffect } from 'react';
import '../assets/css/Reviews.css';


function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
   // Track failed image loads for each review
  const [failedImages, setFailedImages] = useState({});

  // Default fallback image path
  const defaultImage = '/assets/images/default-person.jpg';

  useEffect(() => {
    async function fetchReviews() {
      try {
        //console.log ('Fetching reviews from API...',process.env.REACT_APP_API_URL);
        const response = await fetch(`${apiUrl}/api/reviews`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Transform API response to match expected field names
        const transformedData = data.map(review => ({
          id: review.id,
          author: review.name,
          comment: review.message,
          rating: review.rating,
          photo: review.image || defaultImage, // Use fallback if image is falsy
          createdAt: review.createdAt,
        }));
        setReviews(transformedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Handle image load errors
  const handleImageError = (reviewId) => {
    setFailedImages(prev => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  if (loading) {
    return <div className="reviews-container"><h2>Loading reviews...</h2></div>;
  }

  if (error) {
    return <div className="reviews-container"><h2 className="text-red-500">{error}</h2></div>;
  }

  return (
    <div className="reviews-container">
      <h2 className="reviews-heading">What People Say</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <img
              src={failedImages[review.id] ? defaultImage : `/assets/images/${review.photo}`}
              alt={`${review.author}'s photo`}
              className="review-photo"
              onError={() => handleImageError(review.id)}
            />
            <div className="review-content">
              <h3 className="review-author">{review.author}</h3>
              <p className="review-comment">“{review.comment}”</p>
              <p className="review-rating">⭐ {review.rating}/5</p>
              <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews; 