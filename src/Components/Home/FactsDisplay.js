import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FactsDisplay.css';

const FactsDisplay = () => {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const res = await axios.get('/api/facts/recent');
        setFacts(res.data);
      } catch (err) {
        setFacts([]);
      }
    };
    fetchFacts();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="facts-container">
      <h2 className="facts-title">Today's Pet Facts</h2>
      {facts.length === 0 ? (
        <div className="fact-card">
          <p className="fact-text">📭 No Facts Available Today!</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          pagination={{ clickable: true }}
        >
          {facts.map((fact, i) => (
            <SwiperSlide key={i}>
              <div
                className="fact-card"
                style={{
                  backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/paw-fade.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <p className="fact-text">🐾 {fact.fact}</p>
                <p className="fact-date">📅 {formatDate(fact.createdAt)}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default FactsDisplay;
