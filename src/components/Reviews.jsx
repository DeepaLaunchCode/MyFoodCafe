import React, { useState, useEffect } from 'react';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/reviews.json');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div className="reviews-container">
      <h2 className="reviews-heading">What People Say</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <img src={review.photo} alt={`${review.author}'s photo`} className="review-photo" />
            <div className="review-content">
              <h3 className="review-author">{review.author}</h3>
              <p className="review-comment">“{review.comment}”</p>
              <p className="review-rating">⭐ {review.rating}/5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
