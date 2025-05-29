import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const timelineEvents = [
    {
      year: 2022,
      month: 'March',
      location: 'Downtown',
      title: 'Grand Opening',
      description: 'MyFoodCafe opens its first location in Downtown, introducing a cozy dining experience with a focus on fresh, local ingredients.',
    },
    {
      year: 2023,
      month: 'June',
      location: 'Downtown',
      title: 'Menu Expansion',
      description: 'Introduced a new seasonal menu with vegan and gluten-free options, earning rave reviews from local food critics.',
    },
    {
      year: 2024,
      month: 'January',
      location: 'Westside',
      title: 'Second Location Opens',
      description: 'Expanded to Westside, offering a larger space with outdoor seating and live music events.',
    },
    {
      year: 2024,
      month: 'August',
      location: 'Downtown',
      title: 'Award Recognition',
      description: 'Received the "Best Local Cafe" award for outstanding service and innovative dishes.',
    },
    {
      year: 2025,
      month: 'May',
      location: 'Both Locations',
      title: 'Community Program Launch',
      description: 'Launched a community outreach program, offering free cooking classes and local charity support.',
    },
  ];

  return (
    <div className="about-us">
      <h1>Our Journey</h1>
      <p className="intro">
        Welcome to MyFoodCafe! Over the past three years, we’ve grown from a single location to a beloved community hub with two vibrant spots. Explore our story below.
      </p>


      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="timeline-content">
              <h3>
                {event.month} {event.year} - {event.location}
              </h3>
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;