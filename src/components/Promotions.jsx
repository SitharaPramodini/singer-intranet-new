import React, { useState, useEffect } from 'react';

const Promotions = () => {
  const images = [
    'pro1.jpg',
    'pro2.jpg',
    'pro3.jpg',
    'pro4.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container rounded-lg" style={{ width: '100%', height: '17rem', overflow: 'hidden' }}>
      <img
        src={images[currentIndex]}
        alt={`Slider ${currentIndex + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default Promotions;
