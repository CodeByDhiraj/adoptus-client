import React from "react";
import adoptPet from "./images/adoptPet.png";
import { Link } from "react-router-dom";

const AdoptSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="adopt-section">
      <h2 className="adopt-title">Adopt a Pet</h2>
      <img src={adoptPet} alt="Happy Pet" className="adopt-image" />

      <p className="adopt-description adopt-text">
  Welcome to our pet adoption program! Adopting a pet is a heartwarming
  decision that brings joy, responsibility, and lifelong companionship.
</p>

<h3 className="adopt-subtitle">Why Adopt?</h3>
<ul className="adopt-benefits adopt-text">
  <li>Provide a forever home to a loving animal</li>
  <li>Reduce the number of homeless pets</li>
  <li>Enjoy emotional and physical benefits</li>
</ul>

<h3 className="adopt-subtitle">How It Works</h3>
<ol className="adopt-process adopt-text">
  <li>Browse pets and submit an adoption form</li>
  <li>Meet the selected pet and go through screening</li>
  <li>Complete final paperwork and welcome them home</li>
</ol>

<h3 className="adopt-subtitle">Your Responsibility</h3>
<p className="adopt-responsibility adopt-text">
  Adoption is a lifelong commitment. Provide proper food, shelter,
  exercise, grooming, affection, and routine medical checkups.
</p>


      <Link to="/pets">
        <button className="cta-button" onClick={scrollToTop}>
          🐾 Find Your Perfect Pet
        </button>
      </Link>
    </section>
  );
};

export default AdoptSection;
