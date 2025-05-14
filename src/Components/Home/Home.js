import React from "react";
import HomeLandingContainer from "./HomeLandingContainer";
import CardBelowHome from "./CardBelowHome";
import PlanningToAdoptAPet from "./PlanningToAdoptAPet";
import Testimonials from './Testimonials';
import AdoptionJourney from './AdoptionJourney';
import StatsSection from "./StatsSection";
import FactsDisplay from "./FactsDisplay";

const Home = ({ description }) => {
  return (
    <>
      <HomeLandingContainer description={description} />
      <CardBelowHome />
      <PlanningToAdoptAPet />
      <FactsDisplay />
      <StatsSection />
      <Testimonials />
      <AdoptionJourney />
    </>
  );
};

export default Home;
