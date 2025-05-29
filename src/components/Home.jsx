import React from 'react';
import './Home.css';
import BackToTop from './BackToTop';
function Home() {
  return (<>
    <div className="home-container">
      <div className="video-section">
        <video autoPlay loop muted controls className="responsive-video">
          <source src="foodvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="text-section">
        <h1>Welcome to Our Restaurant</h1>
        <p>Discover the best culinary experience in town. We offer a wide variety of dishes made with fresh ingredients.</p>
        <p>Our restaurant has a rich history, starting from a small family business to a renowned dining spot. We are committed to providing exceptional service and unforgettable meals.</p>
      </div>
    </div>
    <div class="imgcontainer">
      <img class="moving-image" loading="lazy" decoding="async" width="272" height="224" src="logo.jpg" alt="Moving Image" />
</div>
  
    </>
  );
}

export default Home;