import React from "react";
import { Helmet } from "react-helmet-async";
import AdvertisedTickets from "../components/AdvertisedTickets";
import LatestTickets from "../components/LatestTickets";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularRoutes from "../components/PopularRoutes";
import HowItWorks from "../components/HowItWorks";
import TravelPartners from "../components/TravelPartners";
import Testimonials from "../components/Testimonials";
import BookingTips from "../components/BookingTips";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home - Uraan</title>
      </Helmet>
      <Banner />
      <PopularRoutes />
      <AdvertisedTickets />
      <LatestTickets />
      <TravelPartners />
      <HowItWorks />
      <Testimonials />
      <BookingTips />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
