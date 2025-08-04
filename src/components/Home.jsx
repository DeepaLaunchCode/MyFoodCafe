import React from 'react';
import '../assets/css/Home.css';
import BackToTop from '../shared/BackToTop';
function Home() {
  return (<>
    <div className="home-container">
      <div className="video-section">
        <video autoPlay loop muted controls className="responsive-video">
          <source src="assets/videos/foodvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="text-section">
        <h1>Welcome to Our Restaurant</h1>
        <p>Discover the best culinary experience in town. We offer a wide variety of dishes made with fresh ingredients.</p>
        <p>Our restaurant has a rich history, starting from a small family business to a renowned dining spot. We are committed to providing exceptional service and unforgettable meals.</p>
      </div>
    </div>
    <div className="imgcontainer">
      <img className="moving-image" loading="lazy" decoding="async" width="272" height="224" src="assets/images/logo.jpg" alt="Moving Image" />
</div>
  
    </>
  );
}

export default Home;