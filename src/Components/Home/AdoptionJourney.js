import React from 'react';
import './AdoptionJourney.css';
import dogAdopt from './images/dog-journey.png'; // save your dog image in /images folder
import { FaSearch, FaPhoneAlt, FaHeart, FaStethoscope } from 'react-icons/fa';

const steps = [
  {
    icon: <FaSearch />,
    title: 'Search Pets',
    desc: 'Discover dogs, cats & more available near you to adopt.',
  },
  {
    icon: <FaPhoneAlt />,
    title: 'Connect with Us',
    desc: 'Contact verified pet owners or rescue shelters directly.',
  },
  {
    icon: <FaHeart />,
    title: 'Adopt with Love',
    desc: 'Prepare a space at home and follow our guided adoption steps.',
  },
  {
    icon: <FaStethoscope />,
    title: 'Free Vet Consultation',
    desc: 'After successful adoption, get a vet consultation to ensure your pet’s well-being.',
  }
];

const AdoptionJourney = () => {
  return (
    <section className="journey-section">
      <h2 className="journey-title">Your Pet Adoption Journey</h2>
      <div className="journey-wrapper">
        <img src={dogAdopt} alt="dog with adopt board" className="journey-image" />
        <div className="journey-steps">
          {steps.map((step, i) => (
            <div className="journey-step" key={i}>
              <div className="journey-icon">{step.icon}</div>
              <div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdoptionJourney;
