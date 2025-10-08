// src/pages/Home.jsx
import Hero from "../components/Hero";
import HeroIntro from "../components/HeroIntro";
import ShopDetailCards from "../components/ShopDetailCards";
import VendorUpcomingBookings from "../components/VendorUpcomingBookings";
import BidSection from "./Bid/BidSection";

export default function Home() {
  return (
    <>
      <Hero />
      <BidSection />
      <ShopDetailCards />
      <VendorUpcomingBookings />
      <HeroIntro />
    </>
  );
}
