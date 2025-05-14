import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'Ritika Sharma',
    role: 'Pet Adopter',
    rating: 5,
    message: 'AdoptUs made it so easy to find my perfect companion. The team was supportive and helpful throughout!',
    image: '/images/users/user1.jpg'
  },
  {
    name: 'Aman Singh',
    role: 'Pet Giver',
    rating: 4,
    message: 'I felt secure giving my dog to a loving home through AdoptUs. Thank you!',
    image: '/images/users/user2.jpg'
  },
  {
    name: 'Shruti Rajput',
    role: 'User',
    rating: 5,
    message: 'Best platform for connecting pet lovers!',
    image: '/images/users/user3.jpg'
  },
  {
    name: 'Aarohi Mehra',
    role: 'Adoptive Parent',
    rating: 4,
    message: 'AdoptUs helped me find the cutest dog! The process was smooth and the support team is super friendly.',
    image: '/images/users/user4.jpg'
  },
  {
    name: 'Priyanshu Singh',
    role: 'Pet Giver',
    rating: 5,
    message: 'I was worried about giving my dog for adoption, but AdoptUs made me feel safe. Got updates until he found a lovely home!',
    image: '/images/users/user5.jpg'
  },
  {
    name: 'Kabir Kumar',
    role: 'Pet Lover',
    rating: 5,
    message: 'Loved how easy it was to browse and adopt. I now have a furry best friend thanks to this platform!',
    image: '/images/users/user6.jpg'
  }  
];

const Testimonials = () => {
  return (
    <section className="testimonial-section">
      <h2 className="testimonial-title">What Our Users Say</h2>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        loop
        pagination={{ clickable: true }}
      >
        {testimonialsData.map((testimonial, idx) => (
          <SwiperSlide key={idx}>
            <div className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
              <h3>{testimonial.name}</h3>
              <p className="testimonial-role">{testimonial.role}</p>
              <p className="testimonial-message">"{testimonial.message}"</p>
              <div className="stars">
  {[...Array(5)].map((_, i) => (
    <span
      key={i}
      className={`star ${i < testimonial.rating ? 'filled' : ''}`}
    >
      ★
    </span>
  ))}
</div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
